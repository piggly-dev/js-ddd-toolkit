import type { IValueObject } from '@/core/types/index.js';

/**
 * @file A collection of something.
 * @copyright Piggly Lab 2025
 */
export abstract class AbstractCollectionOfValueObjects<
	ValueObject extends IValueObject<any>,
> {
	/**
	 * A map of attrs.
	 *
	 * @type {Map<string, ValueObject>}
	 * @protected
	 * @memberof AbstractCollectionOfValueObjects
	 * @since 3.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _items: Map<string, ValueObject>;

	/**
	 * Creates an instance of AbstractCollectionOfValueObjects.
	 *
	 * @param {Map<string, ValueObject>} [initial]
	 * @public
	 * @constructor
	 * @memberof AbstractCollectionOfValueObjects
	 * @since 3.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(initial?: Map<string, ValueObject>) {
		this._items = initial || new Map();
	}

	/**
	 * Return the items as an array.
	 *
	 * @returns {Array<ValueObject>}
	 * @public
	 * @memberof AbstractCollectionOfValueObjects
	 * @since 3.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get arrayOf(): Array<ValueObject> {
		return Array.from(this._items.values());
	}

	/**
	 * Return the entries (key, value) as an iterable array.
	 *
	 * @returns {Iterator<[string, ValueObject]>}
	 * @public
	 * @memberof AbstractCollectionOfValueObjects
	 * @since 3.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get entries(): Iterator<[string, ValueObject]> {
		return this._items.entries();
	}

	/**
	 * Return the number of attrs.
	 *
	 * @returns {number}
	 * @public
	 * @memberof AbstractCollectionOfValueObjects
	 * @since 3.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get length(): number {
		return this._items.size;
	}

	/**
	 * Return the items as an iterable array.
	 *
	 * @returns {Iterator<ValueObject>}
	 * @public
	 * @memberof AbstractCollectionOfValueObjects
	 * @since 3.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get values(): Iterator<ValueObject> {
		return this._items.values();
	}

	/**
	 * Add an item to the collection.
	 *
	 * @param {ValueObject} item
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfValueObjects
	 * @since 3.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public add(item: ValueObject): this {
		const key = item.hash();

		if (this._items.has(key)) {
			return this;
		}

		this._items.set(key, item);
		return this;
	}

	/**
	 * Add an array of items to the collection.
	 *
	 * @param {Array<ValueObject>} items
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfValueObjects
	 * @since 3.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public addMany(items: Array<ValueObject>): this {
		items.forEach(item => this.add(item));
		return this;
	}

	/**
	 * Append an array of raw items to the collection.
	 * Will replace no matter what.
	 *
	 * @param {Array<ValueObject>} items
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfValueObjects
	 * @since 3.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public appendManyRaw(items: Array<ValueObject>): this {
		items.forEach(item => this.appendRaw(item));
		return this;
	}

	/**
	 * Append a raw item to the collection.
	 * Will replace no matter what.
	 *
	 * @param {ValueObject} item
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfValueObjects
	 * @since 3.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public appendRaw(item: ValueObject): this {
		this._items.set(item.hash(), item);
		return this;
	}

	/**
	 * Clone the collection.
	 *
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfValueObjects
	 * @since 3.3.2
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public abstract clone(): AbstractCollectionOfValueObjects<ValueObject>;

	/**
	 * Find an item by its hash from the collection.
	 *
	 * @param {ValueObject} item
	 * @returns {ValueObject | undefined}
	 * @public
	 * @memberof AbstractCollectionOfValueObjects
	 * @since 3.7.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public find(item: ValueObject): ValueObject | undefined {
		const found = this._items.get(item.hash());

		if (!found) {
			return undefined;
		}

		return found;
	}

	/**
	 * Get an item by its hash from the collection.
	 *
	 * @param {string} hash
	 * @returns {ValueObject | undefined}
	 * @public
	 * @memberof AbstractCollectionOfValueObjects
	 * @since 3.7.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get(hash: string): ValueObject | undefined {
		const found = this._items.get(hash);

		if (!found) {
			return undefined;
		}

		return found;
	}

	/**
	 * Check if the collection has a id.
	 *
	 * @param {ValueObject} item
	 * @returns {boolean}
	 * @public
	 * @memberof AbstractCollectionOfValueObjects
	 * @since 3.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public has(item: ValueObject): boolean {
		return this._items.has(item.hash());
	}

	/**
	 * Check if the collection has all ids.
	 *
	 * @param {Array<ValueObject>} items
	 * @returns {boolean}
	 * @public
	 * @memberof AbstractCollectionOfValueObjects
	 * @since 3.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public hasAll(items: Array<ValueObject>): boolean {
		return items.every(item => this.has(item));
	}

	/**
	 * Check if the collection has any of ids.
	 *
	 * @param {Array<ValueObject>} items
	 * @returns {boolean}
	 * @public
	 * @memberof AbstractCollectionOfValueObjects
	 * @since 3.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public hasAny(items: Array<ValueObject>): boolean {
		return items.some(item => this.has(item));
	}

	/**
	 * Check if the collection has a hash.
	 *
	 * @param {string} hash
	 * @returns {boolean}
	 * @public
	 * @memberof AbstractCollectionOfValueObjects
	 * @since 3.7.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public hasHash(hash: string): boolean {
		return this._items.has(hash);
	}

	/**
	 * Remove id from the collection.
	 * Compatible with old method.
	 *
	 * @param {ID} id
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfValueObjects
	 * @since 3.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public remove(item: ValueObject): this {
		this._items.delete(item.hash());
		return this;
	}

	/**
	 * Remove an item by its hash from the collection.
	 *
	 * @param {string} hash
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfValueObjects
	 * @since 3.7.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public removeHash(hash: string): this {
		this._items.delete(hash);
		return this;
	}

	/**
	 * Sync an item to the collection.
	 * Always add the item to the collection, even if it is already in the collection.
	 *
	 * @param {ValueObject} item
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfValueObjects
	 * @since 3.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public sync(item: ValueObject): this {
		this._items.set(item.hash(), item);
		return this;
	}

	/**
	 * Sync an array of items to the collection.
	 * Always add the items to the collection, even if they are already in the collection.
	 *
	 * @param {Array<ValueObject>} items
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfValueObjects
	 * @since 3.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public syncMany(items: Array<ValueObject>): this {
		items.forEach(item => this.sync(item));
		return this;
	}
}
