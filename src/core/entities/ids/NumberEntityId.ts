import { EntityID } from '@/core/entities/EntityID.js';

/**
 * @file NumberEntityId class.
 * @since 5.0.0
 * @copyright Piggly Lab 2025
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class NumberEntityId extends EntityID<number> {
	/**
	 * Checks if identifier was generated randomly.
	 * It means it was not preloaded from storage.
	 *
	 * @returns {boolean}
	 * @public
	 * @memberof NumberEntityId
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public isRandom(): boolean {
		return this.value === -1 || this._random === true;
	}

	/**
	 * Generate a random number.
	 *
	 * @returns {number}
	 * @public
	 * @memberof NumberEntityId
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected generateRandom(): number {
		// this behavior is expected, should not be random
		// DO NOT change it
		return -1;
	}
}
