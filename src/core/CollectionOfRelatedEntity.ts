import { Entity as BaseEntity } from './Entity';
import { EntityID } from './EntityID';
import { CollectionOfEntity } from './CollectionOfEntity';

/**
 * @file A collection of entities.
 * @copyright Piggly Lab 2023
 */
export class CollectionOfRelatedEntity<
	Entity extends BaseEntity<any, ID>,
	ID extends EntityID<any> = EntityID<any>
> extends CollectionOfEntity<Entity, ID> {}
