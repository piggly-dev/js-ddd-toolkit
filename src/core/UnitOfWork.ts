import DatabaseContext from './DatabaseContext';

/**
 * @file A unit of work to manage repositories and transactions in database context.
 * @copyright Piggly Lab 2023
 */
export default abstract class UnitOfWork<
	DatabaseConnection extends DatabaseContext
> {
	/**
	 * Database context.
	 *
	 * @type {DatabaseConnection} _context
	 * @protected
	 * @memberof UnitOfWork
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _connection: DatabaseConnection;

	/**
	 * Constructor.
	 * Initiate all repositories with same context.
	 *
	 * @param {DatabaseConnection} context
	 * @public
	 * @constructor
	 * @memberof UnitOfWork
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(context: DatabaseConnection) {
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
	public abstract repository(name: string): any;

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
