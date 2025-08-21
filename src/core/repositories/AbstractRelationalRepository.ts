import type {
	IDatabaseDriver,
	IRepository,
	IUnitOfWork,
} from '@/core/repositories/types/index.js';

import { TOrUndefined } from '@/index.js';

/**
 * @file Abstract relational repository.
 * @copyright Piggly Lab 2025
 */
export abstract class AbstractRelationalRepository<
	Driver extends IDatabaseDriver<Engine, Context>,
	Engine extends string,
	Context = unknown,
> implements IRepository<Engine>
{
	/**
	 * The driver associated with the repository.
	 *
	 * @type {Driver}
	 * @protected
	 * @memberof AbstractRelationalRepository
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected readonly _driver: Driver;

	/**
	 * The name of the repository.
	 *
	 * @type {string}
	 * @protected
	 * @memberof AbstractRelationalRepository
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected readonly _name: string;

	/**
	 * The Unit of Work associated with the repository.
	 * When undefined, the repository uses the driver's default UoW.
	 * When defined, the repository operates within this specific UoW context.
	 *
	 * @type {IUnitOfWork<Engine, Context>}
	 * @protected
	 * @memberof AbstractRelationalRepository
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _uow?: IUnitOfWork<Engine, Context>;

	/**
	 * Create a new relational repository.
	 *
	 * @param {string} name The unique name identifier for this repository
	 * @param {Driver} driver The database driver for this repository
	 * @param {IUnitOfWork<Engine, Context>} uow Optional UoW to bind this repository to
	 * @constructor
	 * @memberof AbstractRelationalRepository
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(name: string, driver: Driver, uow?: IUnitOfWork<Engine, Context>) {
		this._name = name;
		this._driver = driver;
		this._uow = uow;
	}

	/**
	 * Get the engine of the repository.
	 *
	 * @returns {Engine}
	 * @public
	 * @memberof AbstractRelationalRepository
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get engine(): Engine {
		return this._driver.engine();
	}

	/**
	 * Get the name of the repository.
	 *
	 * @returns {string}
	 * @public
	 * @memberof AbstractRelationalRepository
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get name(): string {
		return this._name;
	}

	/**
	 * Get the UoW associated with the repository.
	 *
	 * @returns {IUnitOfWork<Engine, Context>}
	 * @public
	 * @memberof AbstractRelationalRepository
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public buildUnitOfWork(): IUnitOfWork<Engine, Context> {
		return this._driver.buildUnitOfWork();
	}

	/**
	 * Clone the repository with an optional Unit of Work.
	 *
	 * Creates a new instance of the repository that:
	 * - Shares the same driver and configuration as the original
	 * - Operates within the provided UoW context (if supplied)
	 * - Is independent from the original repository's UoW
	 *
	 * Use cases:
	 * - Binding a repository to a specific transaction/UoW
	 * - Creating isolated repository instances for parallel operations
	 * - Ensuring repository operations happen within a specific context
	 *
	 * @param {IUnitOfWork<Engine, Context>} uow Optional UoW to bind the cloned repository to
	 * @returns {this} A new repository instance
	 * @abstract
	 * @memberof AbstractRelationalRepository
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public abstract clone(uow?: IUnitOfWork<Engine, Context>): this;

	/**
	 * Check if the repository is compatible with the driver.
	 *
	 * @param {IRepository<Engine>} repository
	 * @returns {boolean}
	 * @public
	 * @memberof AbstractRelationalRepository
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public isCompatibleWith(repository: IRepository<Engine>): boolean {
		return this._driver.isCompatibleWith(repository);
	}

	/**
	 * Get the current database context from the Unit of Work.
	 * Returns undefined if no UoW is bound or if the UoW is not active.
	 *
	 * @returns {TOrUndefined<Context>} The current context or undefined
	 * @protected
	 * @memberof AbstractRelationalRepository
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected context(): TOrUndefined<Context> {
		return this._uow?.getContext();
	}
}
