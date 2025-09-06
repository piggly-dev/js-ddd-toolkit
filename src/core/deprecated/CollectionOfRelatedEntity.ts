import type { IEntity } from '@/core/types/index.js';

import { CollectionOfEntity } from '@/core/entities/CollectionOfEntity.js';
import { EntityID } from '@/core/entities/EntityID.js';

/**
 * It is just a alias for the CollectionOfEntity class.
 *
 * @deprecated Use CollectionOfEntity instead.
 * @file A collection of entities.
 * @copyright Piggly Lab 2023
 */
export class CollectionOfRelatedEntity<
	Entity extends IEntity<ID>,
	ID extends EntityID<any> = EntityID<any>,
> extends CollectionOfEntity<Entity, ID> {}
