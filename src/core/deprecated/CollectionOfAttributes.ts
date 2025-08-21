import type { IAttribute } from '@/core/types/index.js';

import { AbstractCollectionOfAttributes } from '@/core/deprecated/AbstractCollectionOfAttributes.js';

/**
 * @deprecated Attributes is deprecated. Use ValueObjects instead.
 * @file A collection of attributes.
 * @copyright Piggly Lab 2025
 */
export class CollectionOfAttributes<
	Attribute extends IAttribute<any>,
> extends AbstractCollectionOfAttributes<Attribute> {
	/**
	 * Return the attributes as an array.
	 * Alias for `this.arrayOf`.
	 *
	 * @returns {Array<Attribute>}
	 * @public
	 * @memberof AbstractCollectionOfAttributes
	 * @since 3.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get attributes(): Array<Attribute> {
		return this.arrayOf;
	}

	/**
	 * Clone the collection.
	 *
	 * @returns {this}
	 * @public
	 * @memberof CollectionOfAttributes
	 * @since 3.3.2
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public clone(): CollectionOfAttributes<Attribute> {
		const collection = new CollectionOfAttributes<Attribute>();

		this._items.forEach(item => {
			collection.appendRaw(item.clone() as Attribute);
		});

		return collection;
	}
}
