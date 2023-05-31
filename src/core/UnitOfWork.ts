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
	protected _context: DatabaseContext<any>;

	/**
	 * A map of repositories.
	 * You may expose each repository individually.
	 *
	 * @type {Map<string, BaseRepository>}
	 * @protected
	 * @memberof UnitOfWork
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _repos: Map<string, BaseRepository<any, any>> = new Map();

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
	constructor(context: DatabaseContext<any>) {
		this._context = context;
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
	public repository<Repository extends BaseRepository<any, any>>(
		name: string
	): Repository {
		if (this._repos.has(name) === false) {
			throw new Error(`Repository ${name} not found.`);
		}

		return this._repos.get(name) as Repository;
	}

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
