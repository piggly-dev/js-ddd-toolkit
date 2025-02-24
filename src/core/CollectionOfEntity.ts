import { AbstractCollectionOfEntities } from './AbstractCollectionOfEntities';
import { EntityID } from './EntityID';
import type { IEntity } from './types';

/**
 * @file A collection of entities.
 * @copyright Piggly Lab 2023
 */
export class CollectionOfEntity<
	Entity extends IEntity<ID>,
	ID extends EntityID<any> = EntityID<any>
> extends AbstractCollectionOfEntities<string, Entity, ID> {
	/**
	 * Return the entities as an array.
	 * Alias for `this.existingValues`.
	 *
	 * @returns {Array<Entity>}
	 * @public
	 * @memberof AbstractCollectionOfSome
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get entities(): Array<Entity> {
		return this.knowableEntities;
	}

	/**
	 * Get the key for an item.
	 *
	 * @param {Value} item
	 * @returns {Key}
	 * @protected
	 * @memberof AbstractCollectionOfSome
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected getKeyFor(item: Entity): string {
		return item.id.toString();
	}

	/**
	 * Get the id for an item.
	 *
	 * @param {Value} item
	 * @returns {ID}
	 * @protected
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected getIdFor(item: Entity): ID {
		return item.id;
	}

	/**
	 * Get the key for a raw key.
	 *
	 * @param {ID} id
	 * @returns {Key}
	 * @protected
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected idToKey(id: ID): string {
		return id.toString();
	}

	/**
	 * Clone the collection.
	 *
	 * @returns {this}
	 * @public
	 * @memberof AbstractCollectionOfEntities
	 * @since 3.3.2
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public clone(): CollectionOfEntity<Entity, ID> {
		const collection = new CollectionOfEntity<Entity, ID>();

		this._items.forEach(item => {
			collection.appendRaw(item.clone());
		});

		return collection;
	}
}
