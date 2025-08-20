import { CollectionOfEnhancedEntity } from '@/core/entities/CollectionOfEnhancedEntity.js';
import { EntityID } from '@/core/entities/EntityID.js';
import { IEntity } from '@/core/types/index.js';

/**
 * @file A collection of entities.
 * @copyright Piggly Lab 2025
 */
export class CollectionOfRelatedEnhancedEntity<
	Entity extends IEntity<ID>,
	ID extends EntityID<any> = EntityID<any>,
> extends CollectionOfEnhancedEntity<Entity, ID> {
	/**
	 * Clone the collection.
	 *
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.2
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public clone(): CollectionOfRelatedEnhancedEntity<Entity, ID> {
		const collection = new CollectionOfRelatedEnhancedEntity<Entity, ID>();

		this._items.forEach(item => {
			collection.appendRaw(item.clone());
		});

		return collection;
	}
}
