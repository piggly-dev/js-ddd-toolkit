import type { RelatedEntity } from '../types';
import BaseEntity from './Entity';
import EntityID from './EntityID';

/**
 * @file A collection of entities.
 * @copyright Piggly Lab 2023
 */
export default class CollectionOfRelatedEntity<
	Entity extends BaseEntity<any, any>,
	ID extends EntityID<any> = EntityID<any>
> {
	/**
	 * An array of entities.
	 *
	 * @type {Map<ID, RelatedEntity<ID, Entity>>}
	 * @private
	 * @memberof CollectionOfRelatedEntity
	 * @since 2.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	private _items: Map<ID, RelatedEntity<ID, Entity>>;

	/**
	 * Creates an instance of CollectionOfRelatedEntity.
	 *
	 * @param {Map<ID, RelatedEntity<ID, Entity>>} [initial]
	 * @public
	 * @constructor
	 * @memberof CollectionOfRelatedEntity
	 * @since 2.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(initial?: Map<ID, RelatedEntity<ID, Entity>>) {
		this._items = initial || new Map();
	}

	/**
	 * Add an array of entities to the collection.
	 *
	 * @param {Entity[]} entities
	 * @returns {this}
	 * @public
	 * @memberof CollectionOfRelatedEntity
	 * @since 2.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public addMany(entities: Array<RelatedEntity<ID, Entity>>): this {
		entities.forEach(entity => this.add(entity));
		return this;
	}

	/**
	 * Add an entity to the collection.
	 * It may be used to reload an entity.
	 *
	 * @param {Entity} entity
	 * @returns {this}
	 * @public
	 * @memberof CollectionOfRelatedEntity
	 * @since 2.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public add(entity: RelatedEntity<ID, Entity>): this {
		this._items.set(entity.id.value, entity);
		return this;
	}

	/**
	 * Remove an entity by its id from the collection.
	 *
	 * @param {EntityID} id
	 * @returns {this}
	 * @public
	 * @memberof CollectionOfRelatedEntity
	 * @since 2.1.0
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
	 * @memberof CollectionOfRelatedEntity
	 * @since 2.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public has(id: ID): boolean {
		return this._items.has(id.value);
	}

	/**
	 * Check if the collection has all entities.
	 *
	 * @param {Array<ID>} ids
	 * @returns {boolean}
	 * @public
	 * @memberof CollectionOfRelatedEntity
	 * @since 2.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public hasAll(ids: Array<ID>): boolean {
		return ids.every(id => this.has(id));
	}

	/**
	 * Check if the collection has any of entities.
	 *
	 * @param {Array<ID>} ids
	 * @returns {boolean}
	 * @public
	 * @memberof CollectionOfValueObject
	 * @since 2.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public hasAny(ids: Array<ID>): boolean {
		return ids.some(id => this.has(id));
	}

	/**
	 * Get an entity by its id from the collection.
	 *
	 * @param {ID} id
	 * @returns {RelatedEntity<ID, Entity> | undefined}
	 * @public
	 * @memberof CollectionOfRelatedEntity
	 * @since 2.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get(id: ID): RelatedEntity<ID, Entity> | undefined {
		return this._items.get(id.value);
	}

	/**
	 * Find an entity by its content from the collection.
	 *
	 * @param {EntityID} id
	 * @returns {Entity | null}
	 * @public
	 * @memberof CollectionOfRelatedEntity
	 * @since 2.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public find(id: ID): Entity | null {
		const related = this.get(id);

		if (related) {
			return related.entity;
		}

		return null;
	}

	/**
	 * Return the entities as an array.
	 *
	 * @returns {RelatedEntity<ID, Entity>}
	 * @public
	 * @memberof CollectionOfRelatedEntity
	 * @since 2.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get arrayOf(): Array<RelatedEntity<ID, Entity>> {
		return Array.from(this._items.values());
	}

	/**
	 * Return the entities as an array.
	 * May have be less entities than IDs.
	 *
	 * @returns {Array<Entities>}
	 * @public
	 * @memberof CollectionOfRelatedEntity
	 * @since 2.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get entities(): Array<Entity> {
		const entities: Array<Entity> = [];

		this._items.forEach(related => {
			if (related.entity === null) return;

			entities.push(related.entity);
		});

		return entities;
	}

	/**
	 * Return the ids as an array.
	 *
	 * @returns {Array<ID>}
	 * @public
	 * @memberof CollectionOfRelatedEntity
	 * @since 2.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get ids(): Array<ID> {
		return Array.from(this._items.keys());
	}

	/**
	 * Return the number of IDs.
	 *
	 * @returns {number}
	 * @public
	 * @memberof CollectionOfRelatedEntity
	 * @since 2.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get length(): number {
		return this._items.size;
	}
}
