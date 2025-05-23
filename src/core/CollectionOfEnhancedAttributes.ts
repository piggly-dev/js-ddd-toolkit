import { AbstractCollectionOfEnhancedAttributes } from './AbstractCollectionOfEnhancedAttributes';
import { EnhancedAttribute } from './EnhancedAttribute';

/**
 * @file A collection of attributes.
 * @copyright Piggly Lab 2025
 */
export class CollectionOfEnhancedAttributes<
	Attribute extends EnhancedAttribute<any>,
> extends AbstractCollectionOfEnhancedAttributes<Attribute> {
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
	public clone(): CollectionOfEnhancedAttributes<Attribute> {
		const collection = new CollectionOfEnhancedAttributes<Attribute>();

		this._items.forEach(item => {
			collection.appendRaw(item.clone() as Attribute);
		});

		return collection;
	}
}
