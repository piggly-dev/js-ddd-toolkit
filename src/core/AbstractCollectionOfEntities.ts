import type { EntityID } from './EntityID';
import type { IEntity } from './types';
import { OptionalEntity } from './OptionalEntity';

/**
 * @file A collection of something.
 * @copyright Piggly Lab 2025
 */
export abstract class AbstractCollectionOfEntities<
	Key,
	Entity extends IEntity<ID>,
	ID extends EntityID<any> = EntityID<any>
> {
	/**
	 * A map of entities.
	 *
	 * @type {Map<Key, OptionalEntity<Entity, ID>>}
	 * @protected
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _items: Map<Key, OptionalEntity<Entity, ID>>;

	/**
	 * Creates an instance of AbstractCollectionOfEntities.
	 *
	 * @param {Map<Key, OptionalEntity<Entity, ID>>} [initial]
	 * @public
	 * @constructor
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(initial?: Map<Key, OptionalEntity<Entity, ID>>) {
		this._items = initial || new Map();
	}

	/**
	 * Add an item to the collection.
	 *
	 * @param {Entity} item
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public add(item: Entity): this {
		const key = this.getKeyFor(item);

		if (this._items.has(key)) {
			return this;
		}

		this._items.set(key, new OptionalEntity(this.getIdFor(item), item));
		return this;
	}

	/**
	 * Add an array of items to the collection.
	 *
	 * @param {Array<Entity>} items
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public addMany(items: Array<Entity>): this {
		items.forEach(item => this.add(item));
		return this;
	}

	/**
	 * Append a raw item to the collection.
	 * Will replace no matter what.
	 *
	 * @param {OptionalEntity<Entity, ID>} item
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public appendRaw(item: OptionalEntity<Entity, ID>): this {
		this._items.set(this.idToKey(item.id), item);
		return this;
	}

	/**
	 * Append an array of raw items to the collection.
	 * Will replace no matter what.
	 *
	 * @param {Array<OptionalEntity<Entity, ID>>} items
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public appendManyRaw(items: Array<OptionalEntity<Entity, ID>>): this {
		items.forEach(item => this.appendRaw(item));
		return this;
	}

	/**
	 * Reload an item to the collection. Only if the item is already in the collection.
	 *
	 * @param {Entity} item
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @throws {Error} If the item is not found in the collection.
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public reload(item: Entity): this {
		const i = this.get(this.getIdFor(item));

		if (!i) {
			throw new Error('Item not found, cannot be reloaded.');
		}

		i.load(item);
		return this;
	}

	/**
	 * Reload an array of items to the collection.
	 * Only if the items are already in the collection.
	 *
	 * @param {Array<Entity>} items
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @throws {Error} If the item is not found in the collection.
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public reloadMany(items: Array<Entity>): this {
		items.forEach(item => this.reload(item));
		return this;
	}

	/**
	 * Sync an item to the collection. Always add the item to the collection, even if it is already in the collection.
	 *
	 * @param {Entity} item
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public sync(item: Entity): this {
		this._items.set(
			this.getKeyFor(item),
			new OptionalEntity(this.getIdFor(item), item)
		);

		return this;
	}

	/**
	 * Sync an array of items to the collection.
	 * Always add the items to the collection, even if they are already in the collection.
	 *
	 * @param {Array<Entity>} items
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public syncMany(items: Array<Entity>): this {
		items.forEach(item => this.sync(item));
		return this;
	}

	/**
	 * Remove id from the collection.
	 * Compatible with old method.
	 *
	 * @param {ID} id
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public remove(id: ID): this {
		this._items.delete(this.idToKey(id));
		return this;
	}

	/**
	 * Remove key from the collection.
	 *
	 * @param {Key} key
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public removeKey(key: Key): this {
		this._items.delete(key);
		return this;
	}

	/**
	 * Remove item from the collection.
	 *
	 * @param {Entity} item
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public removeItem(item: Entity): this {
		return this.removeKey(this.getKeyFor(item));
	}

	/**
	 * Check if the collection has a id.
	 *
	 * @param {ID} id
	 * @returns {boolean}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public has(id: ID): boolean {
		return this._items.has(this.idToKey(id));
	}

	/**
	 * Check if the collection has all ids.
	 *
	 * @param {Array<ID>} ids
	 * @returns {boolean}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public hasAll(ids: Array<ID>): boolean {
		return ids.every(key => this.has(key));
	}

	/**
	 * Check if the collection has any of ids.
	 *
	 * @param {Array<ID>} ids
	 * @returns {boolean}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public hasAny(ids: Array<ID>): boolean {
		return ids.some(key => this.has(key));
	}

	/**
	 * Check if item is available for an id.
	 *
	 * @param {ID} id
	 * @returns {boolean}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public itemAvailableFor(id: ID): boolean {
		const item = this.get(id);

		if (!item) {
			return false;
		}

		return item.isPresent();
	}

	/**
	 * Check if the collection has a key.
	 *
	 * @param {Key} key
	 * @returns {boolean}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public hasKey(key: Key): boolean {
		return this._items.has(key);
	}

	/**
	 * Check if the collection has all keys.
	 *
	 * @param {Array<Entity>} keys
	 * @returns {boolean}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public hasAllKeys(keys: Array<Key>): boolean {
		return keys.every(key => this.hasKey(key));
	}

	/**
	 * Check if the collection has any of keys.
	 *
	 * @param {Array<Entity>} keys
	 * @returns {boolean}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public hasAnyKeys(keys: Array<Key>): boolean {
		return keys.some(key => this.hasKey(key));
	}

	/**
	 * Check if the collection has an item.
	 *
	 * @param {Entity} item
	 * @returns {boolean}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public hasItem(item: Entity): boolean {
		return this.hasKey(this.getKeyFor(item));
	}

	/**
	 * Check if the collection has all keys.
	 *
	 * @param {Array<Entity>} items
	 * @returns {boolean}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public hasAllItems(items: Array<Entity>): boolean {
		return items.every(item => this.hasItem(item));
	}

	/**
	 * Check if the collection has any of keys.
	 *
	 * @param {Array<Entity>} items
	 * @returns {boolean}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public hasAnyItems(items: Array<Entity>): boolean {
		return items.some(item => this.hasItem(item));
	}

	/**
	 * Get an item by its id from the collection.
	 *
	 * @param {ID} id
	 * @returns {OptionalEntity<Entity, ID> | undefined}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get(id: ID): OptionalEntity<Entity, ID> | undefined {
		return this._items.get(this.idToKey(id));
	}

	/**
	 * Get an item by its key from the collection.
	 *
	 * @param {Key} key
	 * @returns {OptionalEntity<Entity, ID> | undefined}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public getKey(key: Key): OptionalEntity<Entity, ID> | undefined {
		return this._items.get(key);
	}

	/**
	 * Find an item by its id from the collection.
	 *
	 * @param {ID} id
	 * @returns {Entity | undefined}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public find(id: ID): Entity | undefined {
		const found = this.getKey(this.idToKey(id));

		if (!found) {
			return undefined;
		}

		return found.entity;
	}

	/**
	 * Return the items as an array.
	 *
	 * @returns {Array<Entity>}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get arrayOf(): Array<OptionalEntity<Entity, ID>> {
		return Array.from(this._items.values());
	}

	/**
	 * Return the items as an iterable array.
	 *
	 * @returns {Iterator<Entity>}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get values(): Iterator<OptionalEntity<Entity, ID>> {
		return this._items.values();
	}

	/**
	 * Return the existing items as an iterable array.
	 *
	 * @returns {Array<Entity>}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get knowableEntities(): Array<Entity> {
		const values: Array<Entity> = [];

		this._items.forEach(item => {
			if (item.isPresent()) {
				values.push(item.knowableEntity);
			}
		});

		return values;
	}

	/**
	 * Return the entries (key, value) as an iterable array.
	 *
	 * @returns {Iterator<[Key, OptionalEntity<Entity, ID>]>}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get entries(): Iterator<[Key, OptionalEntity<Entity, ID>]> {
		return this._items.entries();
	}

	/**
	 * Return the keys as an array.
	 *
	 * @returns {Array<Key>}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get keys(): Array<Key> {
		return Array.from(this._items.keys());
	}

	/**
	 * Return the ids as an array.
	 *
	 * @returns {Array<Key>}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get ids(): Array<ID> {
		const keys: Array<ID> = [];

		this._items.forEach(item => {
			keys.push(item.id);
		});

		return keys;
	}

	/**
	 * Return the number of entities.
	 *
	 * @returns {number}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get length(): number {
		return this._items.size;
	}

	/**
	 * Clone the collection.
	 *
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.2
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public abstract clone(): AbstractCollectionOfEntities<Key, Entity, ID>;

	/**
	 * Get the key for an item.
	 *
	 * @param {Entity} item
	 * @returns {Key}
	 * @protected
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected abstract getKeyFor(item: Entity): Key;

	/**
	 * Get the id for an item.
	 *
	 * @param {Entity} item
	 * @returns {ID}
	 * @protected
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected abstract getIdFor(item: Entity): ID;

	/**
	 * Get the key for a raw key.
	 *
	 * @param {ID} id
	 * @returns {Key}
	 * @protected
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected abstract idToKey(id: ID): Key;
}
