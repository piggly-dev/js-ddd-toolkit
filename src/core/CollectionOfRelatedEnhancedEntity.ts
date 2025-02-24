import { CollectionOfEnhancedEntity } from './CollectionOfEnhancedEntity';
import type { EnhancedEntity as BaseEnhancedEntity } from './EnhancedEntity';
import type { EntityID } from './EntityID';

/**
 * @file A collection of entities.
 * @copyright Piggly Lab 2025
 */
export class CollectionOfRelatedEnhancedEntity<
	Entity extends BaseEnhancedEntity<any, ID>,
	ID extends EntityID<any> = EntityID<any>
> extends CollectionOfEnhancedEntity<Entity, ID> {}
