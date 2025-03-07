import { CollectionOfEntity } from './CollectionOfEntity';
import { EntityID } from './EntityID';
import { IEntity } from './types';

/**
 * @file A collection of entities.
 * @copyright Piggly Lab 2023
 */
export class CollectionOfEnhancedEntity<
	Entity extends IEntity<ID>,
	ID extends EntityID<any> = EntityID<any>,
> extends CollectionOfEntity<Entity, ID> {}
