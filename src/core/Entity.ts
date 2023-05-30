import EntityID from './EntityID';

/**
 * @file Base entity class.
 * @copyright Piggly Lab 2023
 */
export default abstract class Entity<Props> {
	/**
	 * The entity identifier.
	 *
	 * @type {EntityID}
	 * @protected
	 * @readonly
	 * @memberof Entity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected readonly _id: EntityID;

	/**
	 * The entity props.
	 *
	 * @type {Props}
	 * @protected
	 * @readonly
	 * @memberof Entity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public readonly props: Props;

	/**
	 * Creates an instance of Entity.
	 *
	 * @param {props} props
	 * @param {EntityID | undefined} id
	 * @public
	 * @constructor
	 * @memberof Entity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(props: Props, id?: EntityID) {
		this._id = id || new EntityID();
		this.props = props;
	}

	/**
	 * Gets the entity identifier.
	 *
	 * @returns {EntityID}
	 * @public
	 * @memberof Entity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get id(): EntityID {
		return this._id;
	}

	/**
	 * Checks if two entities are equal.
	 *
	 * @param {Entity<Props>} object
	 * @returns {boolean}
	 * @public
	 * @memberof Entity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public equals(object?: Entity<Props>): boolean {
		if (
			object === null ||
			object === undefined ||
			Entity.isEntity(object) === false
		) {
			return false;
		}

		if (this === object) {
			return true;
		}

		return object._id.equals(this._id);
	}

	/**
	 * Checks if an object is an entity.
	 *
	 * @param {*} object
	 * @returns {boolean}
	 * @public
	 * @static
	 * @memberof Entity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static isEntity(object: any): boolean {
		return object instanceof Entity;
	}
}
