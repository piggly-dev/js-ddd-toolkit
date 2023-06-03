import { PaginateQuery } from '@/types';
import BaseEntity from './Entity';
import CollectionOfEntity from './CollectionOfEntity';
import EntityID from './EntityID';
import Adapter from './Adapter';
import DatabaseContext from './DatabaseContext';

/**
 * @file A repository with default methods to manage entities.
 * @copyright Piggly Lab 2023
 */
export default abstract class Repository<
	Entity extends BaseEntity<any>,
	PersistenceRecord extends Record<string, any>
> {
	/**
	 * Database context.
	 *
	 * @type {DatabaseContext<Context>} _context
	 * @protected
	 * @memberof Repository
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _context: DatabaseContext;

	/**
	 * Constructor.
	 *
	 * @param {DatabaseContext<Context>} context
	 * @public
	 * @constructor
	 * @memberof Repository
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(context: DatabaseContext) {
		this._context = context;
	}

	/**
	 * Find an entity by its id.
	 *
	 * @param {EntityUUID} id
	 * @returns {Promise<Entity | undefined>}
	 * @public
	 * @async
	 * @abstract
	 * @memberof Repository
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public abstract findById(id: EntityID): Promise<Entity | undefined>;

	/**
	 * Find entities by a filter.
	 *
	 * @param {QueryFilter} filter
	 * @param {PaginateQuery} paginate
	 * @returns {Promise<CollectionOfEntity<Entity>>}
	 * @public
	 * @async
	 * @abstract
	 * @memberof Repository
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public abstract find<QueryFilter>(
		filter: QueryFilter,
		paginate: PaginateQuery
	): Promise<CollectionOfEntity<Entity>>;

	/**
	 * Find all entities.
	 *
	 * @param {PaginateQuery} paginate
	 * @returns {Promise<CollectionOfEntity<Entity>>}
	 * @public
	 * @async
	 * @abstract
	 * @memberof Repository
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public abstract findAll(
		paginate: PaginateQuery
	): Promise<CollectionOfEntity<Entity>>;

	/**
	 * Create an entity, only when it has a random id.
	 * Expecting undefined if cannot commit.
	 *
	 * @param {Entity} entity
	 * @returns {Promise<Entity|undefined>}
	 * @public
	 * @async
	 * @abstract
	 * @memberof Repository
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public abstract create(entity: Entity): Promise<Entity | undefined>;

	/**
	 * Update an entity, only when it hasn't a random id.
	 * Expecting undefined if cannot commit.
	 *
	 * @param {Entity} entity
	 * @returns {Promise<Entity|undefined>}
	 * @public
	 * @async
	 * @abstract
	 * @memberof Repository
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public abstract update(entity: Entity): Promise<Entity | undefined>;

	/**
	 * Delete an entity, only when it hasn't a random id.
	 *
	 * @param {Entity} entity
	 * @returns {Promise<boolean>}
	 * @public
	 * @async
	 * @abstract
	 * @memberof Repository
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public abstract delete(entity: Entity): Promise<boolean>;

	/**
	 * Count all entities based on a filter.
	 *
	 * @param {Filter} filter
	 * @returns {Promise<number>}
	 * @public
	 * @abstract
	 * @memberof Repository
	 */
	public abstract sizeOf<QueryFilter>(filter: QueryFilter): Promise<number>;

	/**
	 * Count all entities.
	 *
	 * @returns {Promise<number>}
	 * @public
	 * @abstract
	 * @memberof Repository
	 */
	public abstract size(): Promise<number>;

	/**
	 * Save an entity.
	 * If the entity has a not random id, it will be updated.
	 * If the entity has a random id, it will be created.
	 *
	 * @param {Entity} entity
	 * @returns {Promise<Entity>}
	 * @public
	 * @async
	 * @throws {Error} Cannot save entity
	 * @memberof Repository
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public async save(entity: Entity): Promise<Entity> {
		let _entity;

		if (entity.id.isRandom()) {
			_entity = await this.create(entity);
		} else {
			_entity = await this.update(entity);
		}

		if (_entity === undefined) {
			throw new Error('Cannot save entity');
		}

		return _entity;
	}

	/**
	 * Get the adapter of this repository.
	 *
	 * @returns {Adapter<Entity, PersistenceRecord>}
	 * @public
	 * @abstract
	 * @memberof Repository
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public abstract getAdapter(): Adapter<Entity, PersistenceRecord>;
}
