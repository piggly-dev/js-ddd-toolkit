import BaseEntity from './Entity';
import EntityID from './EntityID';

/**
 * @file A collection of entities.
 * @copyright Piggly Lab 2023
 */
export default class CollectionOfEntity<Entity extends BaseEntity<any>> {
	/**
	 * An array of entities.
	 *
	 * @type {Entity[]}
	 * @private
	 * @memberof CollectionOfEntity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	private _items: Map<EntityID, Entity>;

	/**
	 * Creates an instance of CollectionOfEntity.
	 *
	 * @param {Map<EntityID, Entity>} [initial]
	 * @public
	 * @constructor
	 * @memberof CollectionOfEntity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(initial?: Map<EntityID, Entity>) {
		this._items = initial || new Map();
	}

	/**
	 * Map an array of entities to the collection.
	 *
	 * @param {Entity[]} entities
	 * @returns {this}
	 * @public
	 * @memberof CollectionOfEntity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public map(entities: Entity[]): this {
		entities.forEach(entity => this.add(entity));
		return this;
	}

	/**
	 * Add an entity to the collection.
	 *
	 * @param {Entity} entity
	 * @returns {this}
	 * @public
	 * @memberof CollectionOfEntity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public add(entity: Entity): this {
		if (this._items.has(entity.id)) {
			return this;
		}

		this._items.set(entity.id, entity);
		return this;
	}

	/**
	 * Remove an entity by its id from the collection.
	 *
	 * @param {EntityID} id
	 * @returns {this}
	 * @public
	 * @memberof CollectionOfEntity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public remove(id: EntityID): this {
		this._items.delete(id);
		return this;
	}

	/**
	 * Check if the collection has an entity by its id.
	 *
	 * @param {EntityID} id
	 * @returns {boolean}
	 * @public
	 * @memberof CollectionOfEntity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public has(id: EntityID): boolean {
		return this._items.has(id);
	}

	/**
	 * Get an entity by its id from the collection.
	 *
	 * @param {EntityID} id
	 * @returns {Entity | undefined}
	 * @public
	 * @memberof CollectionOfEntity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get(id: EntityID): Entity | undefined {
		return this._items.get(id);
	}

	/**
	 * Return the entities as an array.
	 *
	 * @returns {Entity[]}
	 * @public
	 * @memberof CollectionOfEntity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get items(): Entity[] {
		return Array.from(this._items.values());
	}

	/**
	 * Return the number of entities.
	 *
	 * @returns {number}
	 * @public
	 * @memberof CollectionOfEntity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get length(): number {
		return this._items.size;
	}
}
