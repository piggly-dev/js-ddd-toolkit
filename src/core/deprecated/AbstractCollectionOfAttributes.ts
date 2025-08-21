import type { IAttribute } from '@/core/types/index.js';

import { EventEmitter } from '@/core/EventEmitter.js';

/**
 * @deprecated While you can still use it, it is not recommended. A Collection for attributes can produce unexpected results, since they are not immutable and can be modified.
 * @file A collection of something.
 * @copyright Piggly Lab 2025
 */
export abstract class AbstractCollectionOfAttributes<
	Attribute extends IAttribute<any>,
> {
	/**
	 * The event emmiter.
	 *
	 * @type {EventEmitter}
	 * @protected
	 * @memberof AbstractCollectionOfEntities
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _emitter: EventEmitter;

	/**
	 * A map of attrs.
	 *
	 * @type {Set<Attribute>}
	 * @protected
	 * @memberof AbstractCollectionOfAttributes
	 * @since 3.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _items: Set<Attribute>;

	/**
	 * Indicates if the entity was modified.
	 *
	 * @type {boolean}
	 * @protected
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.4.1
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _modified: boolean;

	/**
	 * Creates an instance of AbstractCollectionOfAttributes.
	 *
	 * @param {Set<Attribute>} [initial]
	 * @public
	 * @constructor
	 * @memberof AbstractCollectionOfAttributes
	 * @since 3.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(initial?: Set<Attribute>) {
		this._items = initial || new Set();
		this._modified = false;
		this._emitter = new EventEmitter();
	}

	/**
	 * Return the items as an array.
	 *
	 * @returns {Array<Attribute>}
	 * @public
	 * @memberof AbstractCollectionOfAttributes
	 * @since 3.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get arrayOf(): Array<Attribute> {
		return Array.from(this._items.values());
	}

	/**
	 * Return the attributes as an array.
	 * Alias for `this.arrayOf`.
	 *
	 * @returns {Array<Attribute>}
	 * @public
	 * @memberof AbstractCollectionOfAttributes
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get attributes(): Array<Attribute> {
		return this.arrayOf;
	}

	/**
	 * Return the entries (key, value) as an iterable array.
	 *
	 * @returns {Iterator<[string, Attribute]>}
	 * @public
	 * @memberof AbstractCollectionOfAttributes
	 * @since 3.4.0
	 * @since 5.0.0 Change iterator to [Attribute, Attribute]
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get entries(): Iterator<[Attribute, Attribute]> {
		return this._items.entries();
	}

	/**
	 * Return the number of attrs.
	 *
	 * @returns {number}
	 * @public
	 * @memberof AbstractCollectionOfAttributes
	 * @since 3.4.0
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
	 * @memberof AbstractCollectionOfAttributes
	 * @since 3.4.0
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
	 * @memberof AbstractCollectionOfAttributes
	 * @since 3.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public add(item: Attribute): this {
		if (this.find(item) === undefined) {
			this._items.add(item);
			this.markAsModified();
		}

		return this;
	}

	/**
	 * Add an array of items to the collection.
	 *
	 * @param {Array<Attribute>} items
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfAttributes
	 * @since 3.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public addMany(items: Array<Attribute>): this {
		items.forEach(item => this.add(item));
		return this;
	}

	/**
	 * Find an item by its hash from the collection.
	 *
	 * @param {Attribute} item
	 * @returns {Attribute | undefined}
	 * @public
	 * @memberof AbstractCollectionOfAttributes
	 * @since 3.7.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public find(item: Attribute): Attribute | undefined {
		for (const existingItem of this._items) {
			if (existingItem.equals(item)) {
				return existingItem;
			}
		}

		return undefined;
	}

	/**
	 * Check if the collection has a id.
	 *
	 * @param {Attribute} item
	 * @returns {boolean}
	 * @public
	 * @memberof AbstractCollectionOfAttributes
	 * @since 3.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public has(item: Attribute): boolean {
		return this.find(item) !== undefined;
	}

	/**
	 * Check if the collection has all ids.
	 *
	 * @param {Array<Attribute>} items
	 * @returns {boolean}
	 * @public
	 * @memberof AbstractCollectionOfAttributes
	 * @since 3.4.0
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
	 * @memberof AbstractCollectionOfAttributes
	 * @since 3.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public hasAny(items: Array<Attribute>): boolean {
		return items.some(item => this.has(item));
	}

	/**
	 * Evaluate if all entities are modified.
	 *
	 * @returns {boolean}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public isAllAttributesModified(): boolean {
		return this.arrayOf.every(item => item.isModified());
	}

	/**
	 * Evaluate if any entity is modified.
	 *
	 * @returns {boolean}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public isAnyAttributeModified(): boolean {
		return this.arrayOf.some(item => item.isModified());
	}

	/**
	 * Evaluate if the entity is modified.
	 *
	 * @returns {boolean}
	 * @public
	 * @memberof Entity
	 * @since 3.4.1
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public isModified(): boolean {
		return this._modified || this.isAnyAttributeModified();
	}

	/**
	 * Mark the entity as persisted.
	 *
	 * @public
	 * @memberof Entity
	 * @since 3.4.1
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public markAsPersisted(): void {
		this._modified = false;
		this._emitter.emit('persisted', this);

		this.arrayOf.forEach(item => item.markAsPersisted());
	}

	/**
	 * Remove id from the collection.
	 * Compatible with old method.
	 *
	 * @param {ID} id
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfAttributes
	 * @since 3.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public remove(item: Attribute): this {
		const found = this.find(item);

		if (found) {
			this._items.delete(found);
			this.markAsModified();
		}

		return this;
	}

	/**
	 * Mark the entity as modified.
	 *
	 * @public
	 * @memberof Entity
	 * @since 3.4.1
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected markAsModified(): void {
		this._modified = true;
		this._emitter.emit('modified', this);
	}
}
