import { CollectionOfEntitiesIndex } from './types';

/**
 * @file A collection of something.
 * @copyright Piggly Lab 2025
 */
export abstract class AbstractCollectionOfEntities<Key, Value, ID = Key> {
	/**
	 * A map of entities.
	 *
	 * @type {Map<Key, CollectionOfEntitiesIndex<ID, Value>>}
	 * @protected
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _items: Map<Key, CollectionOfEntitiesIndex<ID, Value>>;

	/**
	 * Creates an instance of AbstractCollectionOfEntities.
	 *
	 * @param {Map<Key, CollectionOfEntitiesIndex<ID, Value>>} [initial]
	 * @public
	 * @constructor
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(initial?: Map<Key, CollectionOfEntitiesIndex<ID, Value>>) {
		this._items = initial || new Map();
	}

	/**
	 * Add an item to the collection.
	 *
	 * @param {Value} item
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public add(item: Value): this {
		const key = this.getKeyFor(item);

		if (this._items.has(key)) {
			return this;
		}

		this._items.set(key, { id: this.getIdFor(item), value: item });
		return this;
	}

	/**
	 * Add an array of items to the collection.
	 *
	 * @param {Array<Value>} items
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public addMany(items: Array<Value>): this {
		items.forEach(item => this.add(item));
		return this;
	}

	/**
	 * Reload an item to the collection. Only if the item is already in the collection.
	 *
	 * @param {Value} item
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public reload(item: Value): this {
		const key = this.getKeyFor(item);

		if (!this._items.has(key)) {
			return this;
		}

		this._items.set(key, { id: this.getIdFor(item), value: item });
		return this;
	}

	/**
	 * Reload an array of items to the collection.
	 * Only if the items are already in the collection.
	 *
	 * @param {Array<Value>} items
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public reloadMany(items: Array<Value>): this {
		items.forEach(item => this.reload(item));
		return this;
	}

	/**
	 * Sync an item to the collection. Always add the item to the collection, even if it is already in the collection.
	 *
	 * @param {Value} item
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public sync(item: Value): this {
		this._items.set(this.getKeyFor(item), {
			id: this.getIdFor(item),
			value: item,
		});

		return this;
	}

	/**
	 * Sync an array of items to the collection.
	 * Always add the items to the collection, even if they are already in the collection.
	 *
	 * @param {Array<Value>} items
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public syncMany(items: Array<Value>): this {
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
	 * @param {Value} item
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public removeItem(item: Value): this {
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
		const item = this.getKey(this.idToKey(id));

		if (!item || !item?.value) {
			return false;
		}

		return true;
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
	 * @param {Array<Value>} keys
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
	 * @param {Array<Value>} keys
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
	 * @param {Value} item
	 * @returns {boolean}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public hasItem(item: Value): boolean {
		return this.hasKey(this.getKeyFor(item));
	}

	/**
	 * Check if the collection has all keys.
	 *
	 * @param {Array<Value>} items
	 * @returns {boolean}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public hasAllItems(items: Array<Value>): boolean {
		return items.every(item => this.hasItem(item));
	}

	/**
	 * Check if the collection has any of keys.
	 *
	 * @param {Array<Value>} items
	 * @returns {boolean}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public hasAnyItems(items: Array<Value>): boolean {
		return items.some(item => this.hasItem(item));
	}

	/**
	 * Get an item by its id from the collection.
	 *
	 * @param {ID} id
	 * @returns {CollectionOfEntitiesIndex<ID, Value> | undefined}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get(id: ID): CollectionOfEntitiesIndex<ID, Value> | undefined {
		return this._items.get(this.idToKey(id));
	}

	/**
	 * Get an item by its key from the collection.
	 *
	 * @param {Key} key
	 * @returns {CollectionOfEntitiesIndex<ID, Value> | undefined}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public getKey(key: Key): CollectionOfEntitiesIndex<ID, Value> | undefined {
		return this._items.get(key);
	}

	/**
	 * Find an item by its id from the collection.
	 *
	 * @param {ID} id
	 * @returns {Value | undefined}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public find(id: ID): Value | undefined {
		const found = this.getKey(this.idToKey(id));

		if (!found) {
			return undefined;
		}

		return found.value;
	}

	/**
	 * Return the items as an array.
	 *
	 * @returns {Array<Value>}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get arrayOf(): Array<CollectionOfEntitiesIndex<ID, Value>> {
		return Array.from(this._items.values());
	}

	/**
	 * Return the items as an iterable array.
	 *
	 * @returns {Iterator<Value>}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get values(): Iterator<CollectionOfEntitiesIndex<ID, Value>> {
		return this._items.values();
	}

	/**
	 * Return the existing items as an iterable array.
	 *
	 * @returns {Array<Value>}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get existingValues(): Array<Value> {
		const values: Array<Value> = [];

		this._items.forEach(item => {
			if (item.value) {
				values.push(item.value);
			}
		});

		return values;
	}

	/**
	 * Return the entries (key, value) as an iterable array.
	 *
	 * @returns {Iterator<[Key, CollectionOfEntitiesIndex<ID, Value>]>}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get entries(): Iterator<[Key, CollectionOfEntitiesIndex<ID, Value>]> {
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
	 * Get the key for an item.
	 *
	 * @param {Value} item
	 * @returns {Key}
	 * @protected
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected abstract getKeyFor(item: Value): Key;

	/**
	 * Get the id for an item.
	 *
	 * @param {Value} item
	 * @returns {ID}
	 * @protected
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected abstract getIdFor(item: Value): ID;

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
