import EntityID from './EntityID';

/**
 * @file Base entity class.
 * @copyright Piggly Lab 2023
 */
export default abstract class Entity<Props, Id = string> {
	/**
	 * The entity identifier.
	 *
	 * @type {EntityID<Id>}
	 * @protected
	 * @readonly
	 * @memberof Entity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected readonly _id: EntityID<Id>;

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
	 * @param {EntityID<Id> | undefined} id
	 * @public
	 * @constructor
	 * @memberof Entity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(props: Props, id?: EntityID<Id>) {
		this._id = id || new EntityID<Id>();
		this.props = props;
	}

	/**
	 * Gets the entity identifier.
	 *
	 * @returns {EntityID<Id>}
	 * @public
	 * @memberof Entity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get id(): EntityID<Id> {
		return this._id;
	}

	/**
	 * Checks if two entities are equal.
	 *
	 * @param {Entity<Props, any> | undefined | null} e
	 * @returns {boolean}
	 * @public
	 * @memberof Entity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public equals(e: Entity<Props, any> | undefined | null): boolean {
		if (e === null || e === undefined || Entity.isEntity(e) === false) {
			return false;
		}

		if (this === e) {
			return true;
		}

		return e._id.equals(this._id);
	}

	/**
	 * Checks if an object is an entity.
	 *
	 * @param {*} e
	 * @returns {boolean}
	 * @public
	 * @static
	 * @memberof Entity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static isEntity(e: any): boolean {
		return e instanceof Entity;
	}
}
