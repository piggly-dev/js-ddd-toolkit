/**
 * @file A database context to manage connections, pools and clients.
 * @copyright Piggly Lab 2023
 */
export default abstract class DatabaseContext<Connection> {
	/**
	 * Get the context of the database.
	 * It can be a connection, a pool or a client.
	 * Already connected.
	 *
	 * @returns {Context}
	 * @public
	 * @async
	 * @abstract
	 * @memberof DatabaseContext
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public abstract context<Context = Connection>(): Context;

	/**
	 * Close current context.
	 *
	 * @returns {void}
	 * @public
	 * @async
	 * @abstract
	 * @memberof DatabaseContext
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public abstract close(): Promise<void>;

	/**
	 * Force to quit the database.
	 *
	 * @returns {void}
	 * @public
	 * @async
	 * @abstract
	 * @memberof DatabaseContext
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public abstract quit(): Promise<void>;
}
