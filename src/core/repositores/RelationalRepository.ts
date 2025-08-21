import type {
	IDatabaseDriver,
	IRepository,
	IUnitOfWork,
} from '@/core/repositores/types/index.js';

import { TOrUndefined } from '@/index.js';

export abstract class RelationalRepository<
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
	 * @memberof RelationalRepository
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected readonly _driver: Driver;

	/**
	 * The name of the repository.
	 *
	 * @type {string}
	 * @protected
	 * @memberof RelationalRepository
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected readonly _name: string;

	/**
	 * The context associated with the repository.
	 *
	 * @type {IUnitOfWork<Engine, Context>}
	 * @protected
	 * @memberof RelationalRepository
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _uow?: IUnitOfWork<Engine, Context>;

	/**
	 * Create a new relational repository.
	 *
	 * @param {string} name
	 * @param {Driver} driver
	 * @param {Context} context
	 * @constructor
	 * @memberof RelationalRepository
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
	 * @memberof RelationalRepository
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
	 * @memberof RelationalRepository
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
	 * @memberof RelationalRepository
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public buildUnitOfWork(): IUnitOfWork<Engine, Context> {
		return this._driver.uow();
	}

	/**
	 * Clone the repository.
	 *
	 * @param {IUnitOfWork<Engine, Context>} uow
	 * @returns {this}
	 * @abstract
	 * @memberof RelationalRepository
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
	 * @memberof RelationalRepository
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public isCompatibleWith(repository: IRepository<Engine>): boolean {
		return this._driver.isCompatibleWith(repository);
	}

	/**
	 * Get the current context.
	 *
	 * @returns {TOrUndefined<Context>}
	 * @protected
	 * @memberof RelationalRepository
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected context(): TOrUndefined<Context> {
		return this._uow?.getContext();
	}
}
