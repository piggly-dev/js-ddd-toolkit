import { CollectionOfEnhancedEntity } from '@/core/entities/CollectionOfEnhancedEntity.js';
import { EntityID } from '@/core/entities/EntityID.js';
import { IEntity } from '@/core/types/index.js';

/**
 * It is just a alias for the CollectionOfEntity class.
 *
 * @deprecated Use CollectionOfEntity instead.
 * @file A collection of entities.
 * @copyright Piggly Lab 2025
 */
export class CollectionOfRelatedEnhancedEntity<
	Entity extends IEntity<ID>,
	ID extends EntityID<any> = EntityID<any>,
> extends CollectionOfEnhancedEntity<Entity, ID> {}
