/**
 * @description Database driver interface.
 */
export interface IDatabaseDriver<Engine extends string, Context = unknown> {
	/** @description Check if the repository is compatible with the engine. */
	isCompatibleWith(repository: IRepository<Engine>): boolean;
	/** @description Get the UoW associated with the driver. */
	uow(): IUnitOfWork<Engine, Context>;
	/** @description Get the engine associated with the driver. */
	engine(): Engine;
}

/**
 * @description Repository interface.
 */
export interface IRepository<Engine extends string, Context = unknown> {
	/** @description Check if the repository is compatible with the engine. */
	isCompatibleWith(repository: IRepository<Engine>): boolean;
	/** @description Clone the repository. */
	clone(uow?: IUnitOfWork<Engine, Context>): this;
	/** @description Build the UoW associated with the repository. */
	buildUnitOfWork(): IUnitOfWork<Engine, Context>;
	/** @description Get the engine associated with the repository. */
	engine: Engine;
	/** @description Get the name associated with the repository. */
	name: string;
}

/**
 * @description Unit of Work interface.
 */
export interface IUnitOfWork<Engine extends string, Context = unknown> {
	/** @description Wrapper for: begin → fn → end (commit/rollback). */
	withTransaction<T>(fn: (uow: this) => Promise<T>): Promise<T>;
	/** @description Get the current connection context. */
	getContext(): undefined | Context;
	/** @description Mark the UoW for rollback. It will not throw an error. */
	fail(reason?: unknown): void;
	/** @description Rollback the UoW. Optional, you should use `fail` or `end` instead. */
	rollback(): Promise<void>;
	/** @description Check if the UoW is marked for rollback. */
	isRollbackOnly(): boolean;
	/** @description Commit the UoW. Optional, you should use `end` instead. */
	commit(): Promise<void>;
	/** @description Begin the UoW. Required before using the UoW. */
	begin(): Promise<void>;
	/** @description End the UoW. It will auto rollback or commit the UoW. */
	end(): Promise<void>;
	/** @description Check if the UoW is active. */
	isActive(): boolean;
	/** @description Get the engine associated with the UoW. */
	engine(): Engine;
}
