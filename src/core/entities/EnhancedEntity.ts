import moment from 'moment-timezone';

import type { IEntity } from '@/core/types/index.js';

import { EntityID } from '@/core/entities/EntityID.js';
import { Entity } from '@/core/entities/Entity.js';

/**
 * It is just a alias for the Entity class.
 *
 * @deprecated Use Entity instead.
 * @file Base entity class.
 * @copyright Piggly Lab 2023
 */
export abstract class EnhancedEntity<
		Props extends { updated_at: moment.Moment },
		Id extends EntityID<any>,
	>
	extends Entity<Props, Id>
	implements IEntity<Id> {}
