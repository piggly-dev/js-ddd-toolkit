import DatabaseContext from './DatabaseContext';

/**
 * @file A unit of work to manage repositories and transactions in database context.
 * @copyright Piggly Lab 2023
 */
export default abstract class BaseUnitOfWork<Connection extends DatabaseContext> {
	/**
	 * Database connection that generate contexts.
	 *
	 * @type {DatabaseConnection} _context
	 * @protected
	 * @memberof UnitOfWork
	 * @since 1.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _connection: Connection;

	/**
	 * Constructor.
	 * Initiate all repositories with same context.
	 *
	 * @param {DatabaseConnection} connection
	 * @public
	 * @constructor
	 * @memberof UnitOfWork
	 * @since 1.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(connection: Connection) {
		this._connection = connection;
	}
}
