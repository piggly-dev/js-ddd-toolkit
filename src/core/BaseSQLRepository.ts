import EventBus, { EventPayload } from '@piggly/event-bus';
import { SQL_ERROR_EVENT } from '@/types';
import BaseEntity from './Entity';
import CollectionOfEntity from './CollectionOfEntity';
import Adapter from './Adapter';

/**
 * @file A base repository to be more flexible to implement.
 * @copyright Piggly Lab 2023
 */
export default abstract class BaseSQLRepository<
	Entity extends BaseEntity<any, any>,
	PersistenceRecord extends Record<string, any>,
	DatabaseContext,
	QueryError = any
> {
	/**
	 * Database context.
	 *
	 * @type {DatabaseContext} _context
	 * @protected
	 * @memberof BaseRepository
	 * @since 1.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _database: DatabaseContext;

	/**
	 * Constructor.
	 *
	 * @param {DatabaseContext} context
	 * @public
	 * @constructor
	 * @memberof BaseRepository
	 * @since 1.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(context: DatabaseContext) {
		this._database = context;
	}

	/**
	 * Run a SQL and return any.
	 *
	 * @param {string} sql
	 * @param {any[]} [values]
	 * @protected
	 * @abstract
	 * @memberof BaseRepository
	 * @since 1.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected async raw<T extends Array<any>>(
		sql: string,
		values?: any[]
	): Promise<T | undefined> {
		try {
			return await this.run<T>(sql, values);
		} catch (err) {
			EventBus.instance.publish(
				new EventPayload<SQL_ERROR_EVENT<QueryError>>('SQL_ERROR_EVENT', {
					sql,
					values,
					error: err as QueryError,
				})
			);

			return undefined;
		}
	}

	/**
	 * Read data from SQL return a collection of entities.
	 *
	 * @param {string} sql
	 * @param {any[]} [values]
	 * @protected
	 * @abstract
	 * @memberof BaseRepository
	 * @since 1.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected async read(
		sql: string,
		values?: any[]
	): Promise<CollectionOfEntity<Entity>> {
		const entries = await this.raw<PersistenceRecord[]>(sql, values);
		const collection = new CollectionOfEntity<Entity>();

		if (entries === undefined) {
			return collection;
		}

		entries.forEach(entry => collection.add(this.getAdapter().toEntity(entry)));
		return collection;
	}

	/**
	 * Return writable (insert/update/delete) response for a SQL.
	 *
	 * @param {string} sql
	 * @param {any[]} [values]
	 * @protected
	 * @abstract
	 * @memberof BaseRepository
	 * @since 1.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected async write<WritableQueryResponse>(
		sql: string,
		values?: any[]
	): Promise<WritableQueryResponse[] | undefined> {
		return this.raw<WritableQueryResponse[]>(sql, values);
	}

	/**
	 * Implementation to run a SQL.
	 *
	 * @param {string} sql
	 * @param {any[]} [values]
	 * @returns {Promise<T | undefined>}
	 * @protected
	 * @abstract
	 * @memberof BaseRepository
	 * @since 1.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected abstract run<T extends Array<any>>(
		sql: string,
		values?: any[]
	): Promise<T | undefined>;

	/**
	 * Get the adapter of this repository.
	 *
	 * @returns {Adapter<Entity, PersistenceRecord>}
	 * @public
	 * @abstract
	 * @memberof BaseRepository
	 * @since 1.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public abstract getAdapter(): Adapter<Entity, PersistenceRecord>;
}
