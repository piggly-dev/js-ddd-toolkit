import { CollectionOfEntity } from '@/core/entities/CollectionOfEntity.js';
import { EntityID } from '@/core/entities/EntityID.js';
import { IEntity } from '@/core/types/index.js';

/**
 * @file A collection of entities.
 * @copyright Piggly Lab 2023
 */
export class CollectionOfEnhancedEntity<
	Entity extends IEntity<ID>,
	ID extends EntityID<any> = EntityID<any>,
> extends CollectionOfEntity<Entity, ID> {}
