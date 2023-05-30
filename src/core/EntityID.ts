import { v4 as uuidv4 } from 'uuid';

/**
 * @file Manages entity identifier.
 * @copyright Piggly Lab 2023
 */
export default class EntityID {
	/**
	 * The raw value of the identifier.
	 *
	 * @type {string | number}
	 * @public
	 * @readonly
	 * @memberof EntityID
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public readonly value: string | number;

	/**
	 * Indicates if identifier was randomly generated.
	 *
	 * @type {boolean}
	 * @protected
	 * @memberof EntityUUID
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _random: boolean;

	/**
	 * Creates an instance of EntityID.
	 *
	 * @param {(Id|undefined|null)} value The raw value of the identifier.
	 * @public
	 * @constructor
	 * @memberof EntityID
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(id?: string | number | null) {
		this.value = id || uuidv4();
		this._random = id === undefined || id === null;
	}

	/**
	 * Checks if the identifier is equal to this identifier.
	 *
	 * @param {(EntityID<Id>|undefined|null)} id
	 * @returns {boolean}
	 * @public
	 * @memberof EntityID
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public equals(id: EntityID | undefined | null): boolean {
		if (id === null || id === undefined) {
			return false;
		}

		if (!(id instanceof this.constructor)) {
			return false;
		}

		return id.value === this.value;
	}

	/**
	 * Checks if identifier was generated randomly.
	 * It means it was not preloaded from storage.
	 *
	 * @returns {boolean}
	 * @public
	 * @memberof EntityUUID
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public isRandom(): boolean {
		return this._random;
	}

	/**
	 * Returns a string representation of the identifier.
	 *
	 * @returns {string}
	 * @public
	 * @memberof EntityID
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public toString(): string {
		return String(this.value);
	}
}
