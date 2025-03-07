import type { EntityID } from './EntityID';
import type { IEntity } from './types';

import { CollectionOfEntity } from './CollectionOfEntity';

/**
 * @file A collection of entities.
 * @copyright Piggly Lab 2023
 */
export class CollectionOfRelatedEntity<
	Entity extends IEntity<ID>,
	ID extends EntityID<any> = EntityID<any>,
> extends CollectionOfEntity<Entity, ID> {
	/**
	 * Clone the collection.
	 *
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.2
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public clone(): CollectionOfRelatedEntity<Entity, ID> {
		const collection = new CollectionOfRelatedEntity<Entity, ID>();

		this._items.forEach(item => {
			collection.appendRaw(item.clone());
		});

		return collection;
	}
}
