import moment from 'moment-timezone';
import { EntityID } from './EntityID';
import { EventEmmiter } from './EventEmmiter';

/**
 * @file Base entity class.
 * @copyright Piggly Lab 2023
 */
export abstract class EnhancedEntity<
	Props extends { updated_at: moment.Moment },
	Id extends EntityID<any>
> {
	/**
	 * The entity identifier.
	 *
	 * @type {Id}
	 * @protected
	 * @memberof EnhancedEntity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _id: Id;

	/**
	 * The entity props.
	 *
	 * @type {Props}
	 * @protected
	 * @memberof EnhancedEntity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _props: Props;

	/**
	 * Indicates if the entity was modified.
	 *
	 * @type {boolean}
	 * @protected
	 * @memberof EnhancedEntity
	 * @since 3.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _modified: boolean;

	/**
	 * The event emmiter.
	 *
	 * @type {EventEmmiter}
	 * @protected
	 * @memberof EnhancedEntity
	 * @since 3.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public emmiter: EventEmmiter;

	/**
	 * Creates an instance of EnhancedEntity.
	 *
	 * @param {props} props
	 * @param {Id | undefined} id
	 * @public
	 * @constructor
	 * @memberof EnhancedEntity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(props: Props, id?: Id) {
		this._id = id ?? this.generateId();
		this._props = props;
		this._modified = false;

		this.emmiter = new EventEmmiter();
	}

	/**
	 * Evaluate if the entity is modified.
	 *
	 * @returns {boolean}
	 * @public
	 * @memberof EnhancedEntity
	 * @since 3.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public isModified(): boolean {
		return this._modified;
	}

	/**
	 * Mark the entity as persisted.
	 *
	 * @public
	 * @memberof EnhancedEntity
	 * @since 3.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public markAsPersisted(): void {
		this._modified = false;
		this.emmiter.emit('persisted', this);
	}

	/**
	 * Mark the entity as modified.
	 *
	 * @public
	 * @memberof EnhancedEntity
	 * @since 3.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected markAsModified(): void {
		this._props.updated_at = moment().utc();
		this._modified = true;
		this.emmiter.emit('modified', this);
	}

	/**
	 * Gets the entity identifier.
	 *
	 * @returns {Id}
	 * @public
	 * @memberof EnhancedEntity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get id(): Readonly<Id> {
		return this._id;
	}

	/**
	 * Checks if two entities are equal.
	 *
	 * @param {EnhancedEntity<Props, any> | undefined | null} e
	 * @returns {boolean}
	 * @public
	 * @memberof EnhancedEntity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public equals(e: EnhancedEntity<Props, any> | undefined | null): boolean {
		if (e === null || e === undefined || EnhancedEntity.isEntity(e) === false) {
			return false;
		}

		if (this === e) {
			return true;
		}

		return e._id.equals(this._id);
	}

	/**
	 * Generate a new entity id object.
	 *
	 * @returns {Id}
	 * @protected
	 * @memberof Entity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected generateId(): Id {
		return new EntityID() as Id;
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
		return e instanceof EnhancedEntity;
	}
}
