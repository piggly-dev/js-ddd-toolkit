import type { IValueObject } from '@/core/types/index.js';

/**
 * @file A collection of something.
 * @copyright Piggly Lab 2025
 */
export abstract class AbstractCollectionOfValueObjects<
	ValueObject extends IValueObject<any>,
> {
	/**
	 * A set of value objects.
	 *
	 * @type {Set<ValueObject>}
	 * @protected
	 * @memberof AbstractCollectionOfValueObjects
	 * @since 3.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _items: Set<ValueObject>;

	/**
	 * Creates an instance of AbstractCollectionOfValueObjects.
	 *
	 * @param {Set<ValueObject>} [initial]
	 * @public
	 * @constructor
	 * @memberof AbstractCollectionOfValueObjects
	 * @since 3.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(initial?: Set<ValueObject>) {
		this._items = initial || new Set();
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
		return Array.from(this._items);
	}

	/**
	 * Return the entries as an iterable array (for Set, entries returns [value, value]).
	 *
	 * @returns {Iterator<[ValueObject, ValueObject]>}
	 * @public
	 * @memberof AbstractCollectionOfValueObjects
	 * @since 3.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get entries(): Iterator<[ValueObject, ValueObject]> {
		return this._items.entries();
	}

	/**
	 * Return the number of value objects.
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
		if (this.find(item) === undefined) {
			this._items.add(item);
		}

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
	 * Find an item that equals the given value object.
	 *
	 * @param {ValueObject} item
	 * @returns {ValueObject | undefined}
	 * @public
	 * @memberof AbstractCollectionOfValueObjects
	 * @since 3.7.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public find(item: ValueObject): ValueObject | undefined {
		for (const existingItem of this._items) {
			if (existingItem.equals(item)) {
				return existingItem;
			}
		}

		return undefined;
	}

	/**
	 * Check if the collection has a value object.
	 *
	 * @param {ValueObject} item
	 * @returns {boolean}
	 * @public
	 * @memberof AbstractCollectionOfValueObjects
	 * @since 3.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public has(item: ValueObject): boolean {
		return this.find(item) !== undefined;
	}

	/**
	 * Check if the collection has all value objects.
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
	 * Check if the collection has any of the value objects.
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
	 * Remove a value object from the collection.
	 *
	 * @param {ValueObject} item
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfValueObjects
	 * @since 3.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public remove(item: ValueObject): this {
		const found = this.find(item);
		if (found) {
			this._items.delete(found);
		}
		return this;
	}
}
