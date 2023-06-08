import DatabaseContext from './DatabaseContext';
import BaseRepository from './Repository';

/**
 * @file A unit of work to manage repositories and transactions in database context.
 * @copyright Piggly Lab 2023
 */
export default abstract class UnitOfWork {
	/**
	 * Database context.
	 *
	 * @type {DatabaseContext<Context>} _context
	 * @protected
	 * @memberof UnitOfWork
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _connection: DatabaseContext;

	/**
	 * Constructor.
	 * Initiate all repositories with same context.
	 *
	 * @param {DatabaseContext<Context>} context
	 * @public
	 * @constructor
	 * @memberof UnitOfWork
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(context: DatabaseContext) {
		this._connection = context;
	}

	/**
	 * Get a repository by its name.
	 *
	 * @param {string} name
	 * @returns {Repository}
	 * @public
	 * @memberof UnitOfWork
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public abstract repository<Repository extends BaseRepository<any, any, any>>(
		name: string
	): Repository;

	/**
	 * Begin a transaction in database context.
	 * Changing current context to a transaction.
	 *
	 * @returns {void}
	 * @public
	 * @async
	 * @abstract
	 * @memberof DatabaseContext
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public abstract begin(): Promise<boolean>;

	/**
	 * Commit transactions in database context.
	 * Restore current context to its original state.
	 *
	 * @returns {void}
	 * @public
	 * @async
	 * @abstract
	 * @memberof DatabaseContext
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public abstract commit(): Promise<boolean>;

	/**
	 * Rollback transactions in database context.
	 * Restore current context to its original state.
	 *
	 * @returns {void}
	 * @public
	 * @async
	 * @abstract
	 * @memberof DatabaseContext
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public abstract rollback(): Promise<boolean>;
}
