import { EnhancedAttribute } from '@/core/deprecated/EnhancedAttribute.js';
import { EventEmitter } from '@/core/EventEmitter.js';

/**
 * @deprecated Attributes is deprecated. Use ValueObjects instead.
 * @file A collection of something.
 * @copyright Piggly Lab 2025
 */
export abstract class AbstractCollectionOfEnhancedAttributes<
	Attribute extends EnhancedAttribute<any>,
> {
	/**
	 * A map of attrs.
	 *
	 * @type {Map<string, Attribute>}
	 * @protected
	 * @memberof AbstractCollectionOfEnhancedAttributes
	 * @since 3.4.1
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _items: Map<string, Attribute>;

	/**
	 * Indicates if the attribute was modified.
	 *
	 * @type {boolean}
	 * @protected
	 * @memberof EnhancedAttribute
	 * @since 3.4.1
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _modified: boolean;

	/**
	 * The event emmiter.
	 *
	 * @type {EventEmitter}
	 * @protected
	 * @memberof EnhancedAttribute
	 * @since 3.4.1
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public emmiter: EventEmitter;

	/**
	 * Creates an instance of AbstractCollectionOfEnhancedAttributes.
	 *
	 * @param {Map<string, Attribute>} [initial]
	 * @public
	 * @constructor
	 * @memberof AbstractCollectionOfEnhancedAttributes
	 * @since 3.4.1
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(initial?: Map<string, Attribute>) {
		this._items = initial || new Map();
		this._modified = false;
		this.emmiter = new EventEmitter();
	}

	/**
	 * Return the items as an array.
	 *
	 * @returns {Array<Attribute>}
	 * @public
	 * @memberof AbstractCollectionOfEnhancedAttributes
	 * @since 3.4.1
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get arrayOf(): Array<Attribute> {
		return Array.from(this._items.values());
	}

	/**
	 * Return the entries (key, value) as an iterable array.
	 *
	 * @returns {Iterator<[string, Attribute]>}
	 * @public
	 * @memberof AbstractCollectionOfEnhancedAttributes
	 * @since 3.4.1
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get entries(): Iterator<[string, Attribute]> {
		return this._items.entries();
	}

	/**
	 * Return the number of attrs.
	 *
	 * @returns {number}
	 * @public
	 * @memberof AbstractCollectionOfEnhancedAttributes
	 * @since 3.4.1
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get length(): number {
		return this._items.size;
	}

	/**
	 * Return the items as an iterable array.
	 *
	 * @returns {Iterator<Attribute>}
	 * @public
	 * @memberof AbstractCollectionOfEnhancedAttributes
	 * @since 3.4.1
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get values(): Iterator<Attribute> {
		return this._items.values();
	}

	/**
	 * Add an item to the collection.
	 *
	 * @param {Attribute} item
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfEnhancedAttributes
	 * @since 3.4.1
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public add(item: Attribute): this {
		const key = item.hash();

		if (this._items.has(key)) {
			return this;
		}

		this._items.set(key, item);
		this.markAsModified();
		return this;
	}

	/**
	 * Add an array of items to the collection.
	 *
	 * @param {Array<Attribute>} items
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfEnhancedAttributes
	 * @since 3.4.1
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public addMany(items: Array<Attribute>): this {
		items.forEach(item => this.add(item));
		return this;
	}

	/**
	 * Append an array of raw items to the collection.
	 * Will replace no matter what.
	 *
	 * @param {Array<Attribute>} items
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfEnhancedAttributes
	 * @since 3.4.1
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public appendManyRaw(items: Array<Attribute>): this {
		items.forEach(item => this.appendRaw(item));
		return this;
	}

	/**
	 * Append a raw item to the collection.
	 * Will replace no matter what.
	 *
	 * @param {Attribute} item
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfEnhancedAttributes
	 * @since 3.4.1
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public appendRaw(item: Attribute): this {
		this._items.set(item.hash(), item);
		this.markAsModified();
		return this;
	}

	/**
	 * Clone the collection.
	 *
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfEnhancedAttributes
	 * @since 3.4.1
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public abstract clone(): AbstractCollectionOfEnhancedAttributes<Attribute>;

	/**
	 * Find an item by its hash from the collection.
	 *
	 * @param {Attribute} item
	 * @returns {Attribute | undefined}
	 * @public
	 * @memberof AbstractCollectionOfEnhancedAttributes
	 * @since 3.7.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public find(item: Attribute): Attribute | undefined {
		const found = this._items.get(item.hash());

		if (!found) {
			return undefined;
		}

		return found;
	}

	/**
	 * Get an item by attr from the collection.
	 *
	 * @param {string} hash
	 * @returns {Attribute | undefined}
	 * @public
	 * @memberof AbstractCollectionOfEnhancedAttributes
	 * @since 3.7.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get(hash: string): Attribute | undefined {
		const found = this._items.get(hash);

		if (!found) {
			return undefined;
		}

		return found;
	}

	/**
	 * Check if the collection has a id.
	 *
	 * @param {Attribute} item
	 * @returns {boolean}
	 * @public
	 * @memberof AbstractCollectionOfEnhancedAttributes
	 * @since 3.4.1
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public has(item: Attribute): boolean {
		return this._items.has(item.hash());
	}

	/**
	 * Check if the collection has all ids.
	 *
	 * @param {Array<Attribute>} items
	 * @returns {boolean}
	 * @public
	 * @memberof AbstractCollectionOfEnhancedAttributes
	 * @since 3.4.1
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public hasAll(items: Array<Attribute>): boolean {
		return items.every(item => this.has(item));
	}

	/**
	 * Check if the collection has any of ids.
	 *
	 * @param {Array<Attribute>} items
	 * @returns {boolean}
	 * @public
	 * @memberof AbstractCollectionOfEnhancedAttributes
	 * @since 3.4.1
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public hasAny(items: Array<Attribute>): boolean {
		return items.some(item => this.has(item));
	}

	/**
	 * Check if the collection has a hash.
	 *
	 * @param {string} hash
	 * @returns {boolean}
	 * @public
	 * @memberof AbstractCollectionOfAttributes
	 * @since 3.7.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public hasHash(hash: string): boolean {
		return this._items.has(hash);
	}

	/**
	 * Evaluate if all attributes are modified.
	 *
	 * @returns {boolean}
	 * @public
	 * @memberof AbstractCollectionOfEnhancedAttributes
	 * @since 3.4.1
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public isAllAttributesModified(): boolean {
		return this.arrayOf.every(item => item.isModified());
	}

	/**
	 * Evaluate if any attribute is modified.
	 *
	 * @returns {boolean}
	 * @public
	 * @memberof AbstractCollectionOfEnhancedAttributes
	 * @since 3.4.1
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public isAnyAttributeModified(): boolean {
		return this.arrayOf.some(item => item.isModified());
	}

	/**
	 * Evaluate if the attribute is modified.
	 *
	 * @returns {boolean}
	 * @public
	 * @memberof EnhancedAttribute
	 * @since 3.4.1
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public isModified(): boolean {
		return this._modified || this.isAnyAttributeModified();
	}

	/**
	 * Mark the attribute as persisted.
	 *
	 * @public
	 * @memberof EnhancedAttribute
	 * @since 3.4.1
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public markAsPersisted(): void {
		this._modified = false;
		this.emmiter.emit('persisted', this);

		this.arrayOf.forEach(item => item.markAsPersisted());
	}

	/**
	 * Remove id from the collection.
	 * Compatible with old method.
	 *
	 * @param {ID} id
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfEnhancedAttributes
	 * @since 3.4.1
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public remove(item: Attribute): this {
		this._items.delete(item.hash());
		this.markAsModified();
		return this;
	}

	/**
	 * Remove an item by its hash from the collection.
	 *
	 * @param {string} hash
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfAttributes
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
	 * @param {Attribute} item
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfEnhancedAttributes
	 * @since 3.4.1
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public sync(item: Attribute): this {
		this._items.set(item.hash(), item);
		this.markAsModified();
		return this;
	}

	/**
	 * Sync an array of items to the collection.
	 * Always add the items to the collection, even if they are already in the collection.
	 *
	 * @param {Array<Attribute>} items
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfEnhancedAttributes
	 * @since 3.4.1
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public syncMany(items: Array<Attribute>): this {
		items.forEach(item => this.sync(item));
		return this;
	}

	/**
	 * Mark the attribute as modified.
	 *
	 * @public
	 * @memberof EnhancedAttribute
	 * @since 3.4.1
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected markAsModified(): void {
		this._modified = true;
		this.emmiter.emit('modified', this);
	}
}
