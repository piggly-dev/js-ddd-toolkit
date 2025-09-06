import type { IUnitOfWork } from '@/core/repositories/types/index.js';

import { DomainError } from '@/core/errors/DomainError.js';
import { Result } from '@/core/Result.js';

import type { InMemoryDatabase, InMemoryContext } from './InMemoryDriver.js';

/**
 * In-memory Unit of Work implementation for testing.
 */
export class InMemoryUnitOfWork implements IUnitOfWork<'inmemory', InMemoryContext> {
	private _context?: InMemoryContext;
	private readonly _db: InMemoryDatabase;
	private readonly _engine = 'inmemory' as const;
	// private __failureReason?: unknown; // Reserved for future debugging/logging
	private _isActive = false;
	private _isRollbackOnly = false;
	private _savepoints: Map<string, Map<string, Map<string, any>>> = new Map();

	constructor(db: InMemoryDatabase) {
		this._db = db;
	}

	/**
	 * Get the engine type.
	 */
	public get engine(): 'inmemory' {
		return this._engine;
	}

	/**
	 * Begin a new transaction.
	 */
	public async begin(): Promise<void> {
		if (this._isActive) {
			throw new Error('Transaction already active');
		}

		const transactionId = this._db.beginTransaction();

		this._context = {
			db: this._db,
			isolationLevel: 'READ_COMMITTED',
			transactionId,
		};

		this._isActive = true;
		this._isRollbackOnly = false;
		// this.__failureReason = undefined;
	}

	/**
	 * Commit the transaction.
	 */
	public async commit(): Promise<void> {
		if (!this._isActive || !this._context?.transactionId) {
			throw new Error('No active transaction to commit');
		}

		if (this._isRollbackOnly) {
			throw new Error('Transaction is marked for rollback only');
		}

		this._db.commitTransaction(this._context.transactionId);
		this._isActive = false;
		this._context = undefined;
		this._savepoints.clear();
	}

	/**
	 * Dispose the UoW and clean up resources.
	 */
	public async dispose(): Promise<void> {
		if (this._isActive) {
			await this.end();
		}
		this._savepoints.clear();
	}

	/**
	 * End the transaction (commit or rollback).
	 */
	public async end(): Promise<void> {
		if (!this._isActive) {
			return;
		}

		if (this._isRollbackOnly) {
			await this.rollback();
		} else {
			await this.commit();
		}
	}

	/**
	 * Mark the UoW for rollback.
	 */
	public fail(reason?: unknown): Result<void, DomainError> {
		if (!this._isActive) {
			return Result.fail(
				new DomainError('INACTIVE_UOW', 500, 'UnitOfWork is not active'),
			);
		}

		this._isRollbackOnly = true;
		// this.__failureReason = reason;

		return Result.ok(undefined);
	}

	/**
	 * Get the current connection context.
	 */
	public getContext(): InMemoryContext | undefined {
		return this._context;
	}

	/**
	 * Check if the UoW is active.
	 */
	public isActive(): boolean {
		return this._isActive;
	}

	/**
	 * Check if marked for rollback.
	 */
	public isRollbackOnly(): boolean {
		return this._isRollbackOnly;
	}

	/**
	 * Release a savepoint.
	 */
	public async releaseSavepoint(name: string): Promise<void> {
		if (!this._isActive) {
			throw new Error('No active transaction to release savepoint');
		}

		if (!this._savepoints.has(name)) {
			throw new Error(`Savepoint ${name} not found`);
		}

		this._savepoints.delete(name);
	}

	/**
	 * Rollback the transaction.
	 */
	public async rollback(): Promise<void> {
		if (!this._isActive || !this._context?.transactionId) {
			throw new Error('No active transaction to rollback');
		}

		this._db.rollbackTransaction(this._context.transactionId);
		this._isActive = false;
		this._context = undefined;
		this._savepoints.clear();
	}

	/**
	 * Rollback to a savepoint.
	 */
	public async rollbackTo(name: string): Promise<void> {
		if (!this._isActive) {
			throw new Error('No active transaction to rollback');
		}

		const sp = this._savepoints.get(name);
		if (!sp) {
			throw new Error(`Savepoint ${name} not found`);
		}

		this._db.restoreSavepoint(sp);

		// Remove all savepoints created after this one
		const names = Array.from(this._savepoints.keys());
		const index = names.indexOf(name);
		for (let i = index + 1; i < names.length; i++) {
			this._savepoints.delete(names[i]);
		}
	}

	/**
	 * Create a savepoint.
	 */
	public async savepoint(name: string): Promise<void> {
		if (!this._isActive || !this._context?.transactionId) {
			throw new Error('No active transaction to create savepoint');
		}

		if (this._savepoints.has(name)) {
			throw new Error(`Savepoint ${name} already exists`);
		}

		const sp = this._db.createSavepoint(this._context.transactionId, name);
		this._savepoints.set(name, sp);
	}

	/**
	 * Wrapper for transaction execution.
	 */
	public async scopedTransaction<T>(fn: (uow: this) => Promise<T>): Promise<T> {
		await this.begin();
		try {
			const result = await fn(this);
			await this.end();
			return result;
		} catch (error) {
			this.fail(error);
			await this.end();
			throw error;
		}
	}

	/**
	 * Dispose the UoW and clean up resources.
	 */
	public async [Symbol.asyncDispose](): Promise<void> {
		await this.dispose();
		this._savepoints.clear();
	}
}
