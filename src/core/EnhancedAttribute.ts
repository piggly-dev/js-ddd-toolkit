import { shallowEqual } from 'shallow-equal-object';
import { EventEmmiter } from './EventEmmiter';

/**
 * @file Base attribute class.
 * @copyright Piggly Lab 2023
 */
export abstract class EnhancedAttribute<Props> {
	/**
	 * The attribute props.
	 *
	 * @type {Props}
	 * @protected
	 * @memberof EnhancedAttribute
	 * @since 3.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _props: Props;

	/**
	 * Indicates if the attribute was modified.
	 *
	 * @type {boolean}
	 * @protected
	 * @memberof EnhancedAttribute
	 * @since 3.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _modified: boolean;

	/**
	 * The event emmiter.
	 *
	 * @type {EventEmmiter}
	 * @protected
	 * @memberof EnhancedAttribute
	 * @since 3.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public emmiter: EventEmmiter;

	/**
	 * Creates an instance of EnhancedAttribute.
	 *
	 * @param {props} props
	 * @param {Id | undefined} id
	 * @public
	 * @constructor
	 * @memberof EnhancedAttribute
	 * @since 3.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(props: Props) {
		this._props = props;
		this._modified = false;

		this.emmiter = new EventEmmiter();
	}

	/**
	 * Evaluate if the attribute is modified.
	 *
	 * @returns {boolean}
	 * @public
	 * @memberof EnhancedAttribute
	 * @since 3.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public isModified(): boolean {
		return this._modified;
	}

	/**
	 * Mark the attribute as persisted.
	 *
	 * @public
	 * @memberof EnhancedAttribute
	 * @since 3.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public markAsPersisted(): void {
		this._modified = false;
		this.emmiter.emit('persisted', this);
	}

	/**
	 * Mark the attribute as modified.
	 *
	 * @public
	 * @memberof EnhancedAttribute
	 * @since 3.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected markAsModified(): void {
		this._modified = true;
		this.emmiter.emit('modified', this);
	}

	/**
	 * Checks if two entities are equal.
	 *
	 * @param {EnhancedAttribute<Props, any> | undefined | null} e
	 * @returns {boolean}
	 * @public
	 * @memberof EnhancedAttribute
	 * @since 3.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public equals(e: EnhancedAttribute<Props> | undefined | null): boolean {
		if (
			e === null ||
			e === undefined ||
			EnhancedAttribute.isAttribute(e) === false
		) {
			return false;
		}

		if (this === e) {
			return true;
		}

		return shallowEqual(this._props, e._props);
	}

	/**
	 * Checks if an object is an attribute.
	 *
	 * @param {*} e
	 * @returns {boolean}
	 * @public
	 * @static
	 * @memberof Attribute
	 * @since 3.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static isAttribute(e: any): boolean {
		return e instanceof EnhancedAttribute;
	}
}
