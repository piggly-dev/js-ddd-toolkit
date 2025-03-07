import { ValueObject as BaseValueObject } from './ValueObject';

/**
 * @file A collection of value objects.
 * @copyright Piggly Lab 2024
 */
export class MapCollectionOfValueObjects<
	Key,
	ValueObject extends BaseValueObject<any>,
> {
	/**
	 * An array of value objects.
	 *
	 * @type {Array<ValueObject>}
	 * @private
	 * @memberof CollectionOfValueObject
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	private _items: Map<Key, ValueObject>;

	/**
	 * Creates an instance of CollectionOfValueObject.
	 *
	 * @param {Array<ValueObject>} [initial]
	 * @public
	 * @constructor
	 * @memberof CollectionOfValueObject
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(initial?: Map<Key, ValueObject>) {
		this._items = initial ?? new Map<Key, ValueObject>();
	}

	/**
	 * Return the value objects as an array.
	 *
	 * @returns {Array<ValueObject>}
	 * @public
	 * @memberof CollectionOfValueObject
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get arrayOf(): Array<ValueObject> {
		return Array.from(this._items.values());
	}

	/**
	 * Return the number of value objects.
	 *
	 * @returns {number}
	 * @public
	 * @memberof CollectionOfValueObject
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get length(): number {
		return this._items.size;
	}

	/**
	 * Add an value object to the collection.
	 *
	 * @param {Key} key
	 * @param {ValueObject} item
	 * @returns {this}
	 * @public
	 * @memberof CollectionOfValueObject
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public add(key: Key, item: ValueObject): this {
		this._items.set(key, item);
		return this;
	}

	/**
	 * Get an value object by its key from the collection.
	 *
	 * @param {Key} key
	 * @returns {ValueObject | undefined}
	 * @public
	 * @memberof CollectionOfValueObject
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get(key: Key): ValueObject | undefined {
		return this._items.get(key);
	}

	/**
	 * Check if the collection has an value object.
	 *
	 * @param {Key} key
	 * @returns {boolean}
	 * @public
	 * @memberof CollectionOfValueObject
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public has(key: Key): boolean {
		return this._items.has(key);
	}

	/**
	 * Check if the collection has all value objects.
	 *
	 * @param {ValueObject} items
	 * @returns {boolean}
	 * @public
	 * @memberof CollectionOfValueObject
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public hasAllVO(items: Array<ValueObject>): boolean {
		return items.every(item => this.hasVO(item));
	}

	/**
	 * Check if the collection has any of value objects.
	 *
	 * @param {ValueObject} items
	 * @returns {boolean}
	 * @public
	 * @memberof CollectionOfValueObject
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public hasAnyVO(items: Array<ValueObject>): boolean {
		return items.some(item => this.hasVO(item));
	}

	/**
	 * Check if the collection has an value object.
	 *
	 * @param {ValueObject} item
	 * @returns {boolean}
	 * @public
	 * @memberof CollectionOfValueObject
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public hasVO(item: ValueObject): boolean {
		let has = false;

		for (const [_, vo] of this._items) {
			if (item.equals(vo)) {
				has = true;
				break;
			}
		}

		return has;
	}

	/**
	 * Remove an value object from the collection.
	 *
	 * @param {Key} key
	 * @returns {this}
	 * @public
	 * @memberof CollectionOfValueObject
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public remove(key: Key): this {
		this._items.delete(key);
		return this;
	}

	/**
	 * Remove an value object from the collection.
	 *
	 * @param {ValueObject} item
	 * @returns {this}
	 * @public
	 * @memberof CollectionOfValueObject
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public removeVO(item: ValueObject): this {
		for (const [key, vo] of this._items) {
			if (item.equals(vo)) {
				this._items.delete(key);
				break;
			}
		}

		return this;
	}
}
