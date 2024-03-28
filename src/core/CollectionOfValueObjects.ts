import BaseValueObject from './ValueObject';

/**
 * @file A collection of value objects.
 * @copyright Piggly Lab 2023
 */
export default class CollectionOfValueObjects<
	ValueObject extends BaseValueObject<any>
> {
	/**
	 * An array of value objects.
	 *
	 * @type {ValueObject[]}
	 * @private
	 * @memberof CollectionOfValueObject
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	private _items: ValueObject[];

	/**
	 * Creates an instance of CollectionOfValueObject.
	 *
	 * @param {ValueObject[]} [initial]
	 * @public
	 * @constructor
	 * @memberof CollectionOfValueObject
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(initial?: ValueObject[]) {
		this._items = initial || [];
	}

	/**
	 * Add an value object to the collection.
	 *
	 * @param {ValueObject} item
	 * @returns {this}
	 * @public
	 * @memberof CollectionOfValueObject
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public add(item: ValueObject): this {
		if (this.has(item)) {
			return this;
		}

		this._items.push(item);
		return this;
	}

	/**
	 * Remove an value object from the collection.
	 *
	 * @param {ValueObject} item
	 * @returns {this}
	 * @public
	 * @memberof CollectionOfValueObject
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public remove(item: ValueObject): this {
		const index = this._items.indexOf(item);

		if (index === -1) {
			return this;
		}

		this._items.splice(index, 1);
		return this;
	}

	/**
	 * Check if the collection has an value object.
	 *
	 * @param {ValueObject} item
	 * @returns {boolean}
	 * @public
	 * @memberof CollectionOfValueObject
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public has(item: ValueObject): boolean {
		return this.find(item) !== undefined;
	}

	/**
	 * Check if the collection has all value objects.
	 *
	 * @param {ValueObject} items
	 * @returns {boolean}
	 * @public
	 * @memberof CollectionOfValueObject
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public hasAll(items: ValueObject[]): boolean {
		return items.every(item => this.has(item));
	}

	/**
	 * Check if the collection has any of value objects.
	 *
	 * @param {ValueObject} items
	 * @returns {boolean}
	 * @public
	 * @memberof CollectionOfValueObject
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public hasAny(items: ValueObject[]): boolean {
		return items.some(item => this.has(item));
	}

	/**
	 * Get an value object by its index from the collection.
	 *
	 * @param {number} index
	 * @returns {ValueObject | undefined}
	 * @public
	 * @memberof CollectionOfValueObject
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get(index: number): ValueObject | undefined {
		return this._items[index] || undefined;
	}

	/**
	 * Find an value object by its content from the collection.
	 *
	 * @param {ValueObject} item
	 * @returns {ValueObject | undefined}
	 * @public
	 * @memberof CollectionOfValueObject
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public find(item: ValueObject): ValueObject | undefined {
		return this._items.find(_item => _item.equals(item));
	}

	/**
	 * Return the value objects as an array.
	 *
	 * @returns {ValueObject[]}
	 * @public
	 * @memberof CollectionOfValueObject
	 * @since 2.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get arrayOf(): ValueObject[] {
		return Array.from(this._items.values());
	}

	/**
	 * Return the number of value objects.
	 *
	 * @returns {number}
	 * @public
	 * @memberof CollectionOfValueObject
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get length(): number {
		return this._items.length;
	}
}
