import type { EntityID } from './EntityID';
import { CollectionOfEntity } from './CollectionOfEntity';
import type { IEntity } from './types';

/**
 * @file A collection of entities.
 * @copyright Piggly Lab 2023
 */
export class CollectionOfRelatedEntity<
	Entity extends IEntity<ID>,
	ID extends EntityID<any> = EntityID<any>
> extends CollectionOfEntity<Entity, ID> {}
