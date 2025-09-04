import crypto from 'node:crypto';

import { EntityID } from '@/core/entities/EntityID.js';

/**
 * @file UUIDEntityId class.
 * @since 1.6.0
 * @copyright Piggly Lab 2025
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class UUIDEntityId extends EntityID<string> {
	/**
	 * Generate a UUIDv4 without mark entity id as random.
	 *
	 * @returns {UUIDEntityId}
	 * @public
	 * @memberof UUIDEntityId
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static generate(): UUIDEntityId {
		return new UUIDEntityId(crypto.randomUUID());
	}
}
