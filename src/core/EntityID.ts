import { v4 as uuidv4 } from 'uuid';

/**
 * @file Manages entity identifier.
 * @copyright Piggly Lab 2023
 */
export class EntityID<Value = string> {
	/**
	 * The raw value of the identifier.
	 *
	 * @type {Value}
	 * @public
	 * @readonly
	 * @memberof EntityID
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public readonly value: Value;

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
	constructor(id?: Value | null) {
		this.value = (id ?? this.generateRandom()) as Value;
		this._random = id === undefined || id === null;
	}

	/**
	 * Checks if the identifier is equal to this identifier.
	 *
	 * @param {(EntityID<any>|undefined|null)} id
	 * @returns {boolean}
	 * @public
	 * @memberof EntityID
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public equals(id: EntityID<any> | undefined | null): boolean {
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
		if (typeof this.value === 'string') {
			return this.value;
		}

		return String(this.value);
	}

	/**
	 * Returns an integer representation of the identifier.
	 *
	 * @returns {number}
	 * @public
	 * @memberof EntityID
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public toNumber(): number {
		if (typeof this.value === 'number') {
			return this.value;
		}

		return Number(this.value);
	}

	/**
	 * Generate a random value to entity id.
	 *
	 * @protected
	 * @memberof EntityID
	 * @since 2.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected generateRandom(): Value {
		return uuidv4() as Value;
	}
}
