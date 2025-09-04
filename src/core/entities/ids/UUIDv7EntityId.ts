import { v7 as uuidv7 } from 'uuid';

import { EntityID } from '@/core/entities/EntityID.js';

/**
 * @file UUIDv7EntityId class.
 * @since 5.0.0
 * @copyright Piggly Lab 2025
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class UUIDv7EntityId extends EntityID<string> {
	/**
	 * Generate a random UUIDv7.
	 *
	 * @returns {string}
	 * @public
	 * @memberof UUIDv7EntityId
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected generateRandom(): string {
		// this behavior is expected, should not be random
		// DO NOT change it
		return uuidv7();
	}

	/**
	 * Generate a UUIDv7 without mark entity id as random.
	 *
	 * @returns {UUIDv7EntityId}
	 * @public
	 * @memberof UUIDv7EntityId
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static generate(): UUIDv7EntityId {
		return new UUIDv7EntityId(uuidv7());
	}
}
