import type { IValueObject } from '@/core/types/index.js';

import { AbstractCollectionOfValueObjects } from '@/core/vos/AbstractCollectionOfValueObjects.js';

/**
 * @file A collection of value objects.
 * @copyright Piggly Lab 2023
 */
export class CollectionOfValueObjects<
	ValueObject extends IValueObject<any>,
> extends AbstractCollectionOfValueObjects<ValueObject> {
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
	public get vos(): Array<ValueObject> {
		return this.arrayOf;
	}
}
