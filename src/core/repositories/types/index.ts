/**
 * @description Transaction isolation level type.
 * @since 5.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export type TransactionIsolationLevelType =
	| 'READ_UNCOMMITTED'
	| 'REPEATABLE_READ'
	| 'READ_COMMITTED'
	| 'SERIALIZABLE';

/**
 * @description Begin transaction options.
 * @since 5.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export type BeginTransactionOptions = Partial<{
	database: string;
	isolationLevel: TransactionIsolationLevelType;
}>;

/**
 * @description Database driver interface.
 */
export interface IDatabaseDriver<Engine extends string, Context = unknown> {
	/**
	 * @description Check if the repository is compatible with the engine.
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	isCompatibleWith(repository: IRepository<Engine>): boolean;
	/**
	 * @description Get the UoW associated with the driver. It should return a new instance of the UoW for each call.
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	buildUnitOfWork(): IUnitOfWork<Engine, Context>;
	/**
	 * @description Get the context associated with the driver.
	 * @param {string} database The database name to get the context for. If not provided, it should return the default context with default database.
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	context(database?: string): Promise<Context>;
	/**
	 * @description Get the signature of the connection associated with the driver.
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	connectionSignature: string;
	/**
	 * @description Get the engine associated with the driver.
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	engine: Engine;
}

/**
 * @description Repository interface.
 */
export interface IRepository<Engine extends string, Context = unknown> {
	/**
	 * @description Check if the repository is compatible with the engine.
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	isCompatibleWith(repository: IRepository<Engine>): boolean;
	/**
	 * @description Clone the repository.
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	clone(uow?: IUnitOfWork<Engine, Context>): this;
	/**
	 * @description Build the UoW associated with the repository.
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	buildUnitOfWork(): IUnitOfWork<Engine, Context>;
	/**
	 * @description Get the signature of the connection associated with the driver.
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	connectionSignature: string;
	/**
	 * @description Get the engine associated with the repository.
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	engine: Engine;
	/**
	 * @description Get the name associated with the repository.
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	name: string;
}

/**
 * @description Unit of Work interface.
 */
export interface IUnitOfWork<Engine extends string, Context = unknown> {
	/**
	 * @description Wrapper for: begin → fn → end (commit/rollback). It will auto commit/rollback.
	 * @throws {Error} It will propagate the error. But the transaction will be rolled back and ended.
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	scopedTransaction<T>(fn: (uow: this) => Promise<T>): Promise<T>;
	/**
	 * @description Begin the UoW. Required before using the UoW.
	 * @param {string} database The database name to begin the UoW for. If not provided, it should begin the UoW with the default database.
	 * @throws {Error} If the UoW is not active or something went wrong.
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	begin(options?: BeginTransactionOptions): Promise<void>;
	/**
	 * @description Release a savepoint.
	 * @throws {Error} If the UoW is not active or something went wrong.
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	releaseSavepoint(savepoint: string): Promise<void>;
	/**
	 * @description Rollback to a specific savepoint.
	 * @throws {Error} If the UoW is not active or something went wrong.
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	rollbackTo(savepoint: string): Promise<void>;
	/**
	 * @description Create a savepoint for nested transactions.
	 * @throws {Error} If the UoW is not active or something went wrong.
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	savepoint(savepoint: string): Promise<void>;
	/**
	 * @description Dispose the UoW and clean up resources.
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	[Symbol.asyncDispose](): Promise<void>;
	/**
	 * @description Get the current connection context.
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	getContext(): undefined | Context;
	/**
	 * @description Rollback the current UoW transaction.
	 * @throws {Error} If the UoW is not active or something went wrong.
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	rollback(): Promise<void>;
	/**
	 * @description Dispose the UoW and clean up resources.
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	dispose(): Promise<void>;
	/**
	 * @description Commit the current UoW transaction.
	 * @throws {Error} If the UoW is not active or something went wrong.
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	commit(): Promise<void>;
	/**
	 * @description End the UoW.
	 * @throws {Error} If the UoW is not active or something went wrong.
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	end(): Promise<void>;
	/**
	 * @description Check if the UoW is active.
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	isActive(): boolean;
	/**
	 * @description Get the engine associated with the UoW.
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	engine: Engine;
}
