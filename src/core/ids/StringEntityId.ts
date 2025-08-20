import { EntityID } from '@/core/EntityID.js';

/**
 * @file StringEntityId class.
 * @since 5.0.0
 * @copyright Piggly Lab 2025
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class StringEntityId extends EntityID<string> {
	/**
	 * Checks if identifier was generated randomly.
	 * It means it was not preloaded from storage.
	 *
	 * @returns {boolean}
	 * @public
	 * @memberof StringEntityId
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public isRandom(): boolean {
		return this.value === '<empty>' || this._random === true;
	}

	/**
	 * Generate a random string.
	 *
	 * @returns {string}
	 * @public
	 * @memberof StringEntityId
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected generateRandom(): string {
		// this behavior is expected, should not be random
		// DO NOT change it
		return '<empty>';
	}
}
