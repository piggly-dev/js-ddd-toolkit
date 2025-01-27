import { EnhancedEntity as BaseEntity } from './EnhancedEntity';
import { EntityID } from './EntityID';

/**
 * @file A collection of entities.
 * @copyright Piggly Lab 2023
 */
export class CollectionOfEnhancedEntity<
	Entity extends BaseEntity<any, any>,
	ID extends EntityID<any> = EntityID<any>
> {
	/**
	 * An array of entities.
	 *
	 * @type {Array<Entity>}
	 * @private
	 * @memberof CollectionOfEnhancedEntity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	private _items: Map<ID, Entity>;

	/**
	 * Creates an instance of CollectionOfEnhancedEntity.
	 *
	 * @param {Map<ID, Entity>} [initial]
	 * @public
	 * @constructor
	 * @memberof CollectionOfEnhancedEntity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(initial?: Map<ID, Entity>) {
		this._items = initial || new Map();
	}

	/**
	 * Add an array of entities to the collection.
	 *
	 * @param {Array<Entity>} entities
	 * @returns {this}
	 * @public
	 * @memberof CollectionOfEnhancedEntity
	 * @since 1.0.0
	 * @since 2.0.0 Change name
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public addMany(entities: Array<Entity>): this {
		entities.forEach(entity => this.add(entity));
		return this;
	}

	/**
	 * Add an entity to the collection.
	 *
	 * @param {Entity} entity
	 * @returns {this}
	 * @public
	 * @memberof CollectionOfEnhancedEntity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public add(entity: Entity): this {
		if (this._items.has(entity.id.value)) {
			return this;
		}

		this._items.set(entity.id.value, entity);
		return this;
	}

	/**
	 * Remove an entity by its id from the collection.
	 *
	 * @param {EntityID} id
	 * @returns {this}
	 * @public
	 * @memberof CollectionOfEnhancedEntity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public remove(id: ID): this {
		this._items.delete(id.value);
		return this;
	}

	/**
	 * Check if the collection has an entity by its id.
	 *
	 * @param {EntityID} id
	 * @returns {boolean}
	 * @public
	 * @memberof CollectionOfEnhancedEntity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public has(id: ID): boolean {
		return this._items.has(id.value);
	}

	/**
	 * Check if the collection has all entities.
	 *
	 * @param {EntityID} ids
	 * @returns {boolean}
	 * @public
	 * @memberof CollectionOfEnhancedEntity
	 * @since 2.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public hasAll(ids: Array<ID>): boolean {
		return ids.every(id => this.has(id));
	}

	/**
	 * Check if the collection has any of entities.
	 *
	 * @param {EntityID} ids
	 * @returns {boolean}
	 * @public
	 * @memberof CollectionOfValueObject
	 * @since 2.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public hasAny(ids: Array<ID>): boolean {
		return ids.some(id => this.has(id));
	}

	/**
	 * Get an entity by its id from the collection.
	 *
	 * @param {EntityID} id
	 * @returns {Entity | undefined}
	 * @public
	 * @memberof CollectionOfEnhancedEntity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get(id: ID): Entity | undefined {
		return this._items.get(id.value);
	}

	/**
	 * Find an entity by its content from the collection.
	 *
	 * @param {EntityID} id
	 * @returns {Entity | undefined}
	 * @public
	 * @memberof CollectionOfEnhancedEntity
	 * @since 2.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public find(id: ID): Entity | undefined {
		return this.get(id);
	}

	/**
	 * Return the entities as an array.
	 *
	 * @returns {Array<Entity>}
	 * @public
	 * @memberof CollectionOfEnhancedEntity
	 * @since 2.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get arrayOf(): Array<Entity> {
		return Array.from(this._items.values());
	}

	/**
	 * Return the entities as an array.
	 * Alias to `arrayOf`.
	 *
	 * @returns {Array<Entity>}
	 * @public
	 * @memberof CollectionOfEnhancedEntity
	 * @since 2.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get entities(): Array<Entity> {
		return this.arrayOf;
	}

	/**
	 * Return the ids as an array.
	 *
	 * @returns {Array<ID>}
	 * @public
	 * @memberof CollectionOfEnhancedEntity
	 * @since 2.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get ids(): Array<ID> {
		return Array.from(this._items.keys());
	}

	/**
	 * Return the number of entities.
	 *
	 * @returns {number}
	 * @public
	 * @memberof CollectionOfEnhancedEntity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get length(): number {
		return this._items.size;
	}
}
