import type { EntityID } from '@/core/entities/EntityID.js';

import { Entity } from '@/core/entities/Entity.js';

/**
 * @file Base aggregate class.
 * @copyright Piggly Lab 2025
 */
export abstract class AggregateRoot<Props, Id extends EntityID<any>> extends Entity<
	Props,
	Id
> {
	/**
	 * Checks if the object is a specific component type.
	 *
	 * @param {string} name
	 * @returns {boolean}
	 * @public
	 * @memberof Entity
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public is(name: string): boolean {
		return name.toLowerCase() === 'aggregateroot';
	}
}
