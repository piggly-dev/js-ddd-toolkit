import type {
	IDatabaseDriver,
	IRepository,
	IUnitOfWork,
} from '@/core/repositories/types/index.js';

import { InMemoryUnitOfWork } from './InMemoryUnitOfWork';

/**
 * In-memory database context for testing.
 * Simulates a database connection with transaction support.
 */
export interface InMemoryContext {
	/** Transaction isolation level */
	isolationLevel:
		| 'READ_UNCOMMITTED'
		| 'REPEATABLE_READ'
		| 'READ_COMMITTED'
		| 'SERIALIZABLE';
	/** Current transaction ID */
	transactionId?: string;
	/** Database instance */
	db: InMemoryDatabase;
}

/**
 * Simple in-memory database for testing.
 */
export class InMemoryDatabase {
	/** Main data storage */
	private _data: Map<string, Map<string, any>> = new Map();
	/** Transaction snapshots */
	private _snapshots: Map<string, Map<string, Map<string, any>>> = new Map();
	/** Transaction counter for unique IDs */
	private _transactionCounter = 0;
	/** Active transactions */
	private _transactions: Set<string> = new Set();

	/**
	 * Begin a new transaction.
	 */
	public beginTransaction(): string {
		const txId = `tx_${++this._transactionCounter}`;
		this._transactions.add(txId);

		// Create snapshot of current state
		const snapshot = new Map<string, Map<string, any>>();
		for (const [collection, data] of this._data) {
			snapshot.set(collection, new Map(data));
		}
		this._snapshots.set(txId, snapshot);

		return txId;
	}

	/**
	 * Clear all data.
	 */
	public clear(): void {
		this._data.clear();
		this._snapshots.clear();
		this._transactions.clear();
		this._transactionCounter = 0;
	}

	/**
	 * Commit a transaction.
	 */
	public commitTransaction(txId: string): void {
		if (!this._transactions.has(txId)) {
			throw new Error(`Transaction ${txId} not found`);
		}

		// Remove snapshot and transaction
		this._snapshots.delete(txId);
		this._transactions.delete(txId);
	}

	/**
	 * Create a savepoint.
	 */
	public createSavepoint(
		txId: string,
		__name: string,
	): Map<string, Map<string, any>> {
		if (!this._transactions.has(txId)) {
			throw new Error(`Transaction ${txId} not found`);
		}

		// Return current state as savepoint
		const savepoint = new Map<string, Map<string, any>>();
		for (const [collection, data] of this._data) {
			savepoint.set(collection, new Map(data));
		}
		return savepoint;
	}

	/**
	 * Get a collection (table).
	 */
	public getCollection(name: string): Map<string, any> {
		if (!this._data.has(name)) {
			this._data.set(name, new Map());
		}
		return this._data.get(name)!;
	}

	/**
	 * Check if a transaction is active.
	 */
	public isTransactionActive(txId: string): boolean {
		return this._transactions.has(txId);
	}

	/**
	 * Restore to a savepoint.
	 */
	public restoreSavepoint(savepoint: Map<string, Map<string, any>>): void {
		this._data = new Map(savepoint);
	}

	/**
	 * Rollback a transaction.
	 */
	public rollbackTransaction(txId: string): void {
		if (!this._transactions.has(txId)) {
			throw new Error(`Transaction ${txId} not found`);
		}

		// Restore snapshot
		const snapshot = this._snapshots.get(txId);
		if (snapshot) {
			this._data = new Map(snapshot);
		}

		// Remove snapshot and transaction
		this._snapshots.delete(txId);
		this._transactions.delete(txId);
	}
}

/**
 * In-memory database driver for testing repository pattern.
 */
export class InMemoryDriver implements IDatabaseDriver<'inmemory', InMemoryContext> {
	private readonly _db: InMemoryDatabase;
	private readonly _engine = 'inmemory' as const;

	constructor(db?: InMemoryDatabase) {
		this._db = db || new InMemoryDatabase();
	}

	public get connectionSignature(): string {
		return `signature`;
	}

	/**
	 * Get the database instance.
	 */
	public get db(): InMemoryDatabase {
		return this._db;
	}

	/**
	 * Get the engine type.
	 */
	public get engine(): 'inmemory' {
		return this._engine;
	}

	/**
	 * Create a new Unit of Work.
	 */
	public buildUnitOfWork(): IUnitOfWork<'inmemory', InMemoryContext> {
		return new InMemoryUnitOfWork(this._db);
	}

	public async context(database?: string): Promise<InMemoryContext> {
		return {
			db: this._db,
			isolationLevel: 'READ_UNCOMMITTED',
			transactionId: this._db.beginTransaction(),
		};
	}

	/**
	 * Check if repository is compatible.
	 */
	public isCompatibleWith(repository: IRepository<'inmemory'>): boolean {
		return repository.engine === this._engine;
	}
}
