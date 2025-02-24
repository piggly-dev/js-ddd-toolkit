import { CollectionOfEntity } from './CollectionOfEntity';
import type { EntityID } from './EntityID';
import type { IEntity } from './types';

/**
 * @file A collection of entities.
 * @copyright Piggly Lab 2025
 */
export class CollectionOfRelatedEnhancedEntity<
	Entity extends IEntity<ID>,
	ID extends EntityID<any> = EntityID<any>
> extends CollectionOfEntity<Entity, ID> {}
