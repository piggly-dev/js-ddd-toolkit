import { EventEmmiter } from './EventEmmiter';
import { Attribute } from './Attribute';
import { IAttribute } from './types';

/**
 * @file Base attribute class.
 * @copyright Piggly Lab 2023
 */
export abstract class EnhancedAttribute<Props extends Record<any, any>>
	extends Attribute<Props>
	implements IAttribute<Props>
{
	/**
	 * Indicates if the attribute was modified.
	 *
	 * @type {boolean}
	 * @protected
	 * @memberof EnhancedAttribute
	 * @since 3.4.1
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _modified: boolean;

	/**
	 * The event emmiter.
	 *
	 * @type {EventEmmiter}
	 * @protected
	 * @memberof EnhancedAttribute
	 * @since 3.4.1
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
	 * @since 3.4.1
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected constructor(props: Props) {
		super(props);
		this._modified = false;
		this.emmiter = new EventEmmiter();
	}

	/**
	 * Evaluate if the attribute is modified.
	 *
	 * @returns {boolean}
	 * @public
	 * @memberof EnhancedAttribute
	 * @since 3.4.1
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
	 * @since 3.4.1
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
	 * @since 3.4.1
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected markAsModified(): void {
		this._modified = true;
		this.emmiter.emit('modified', this);
	}
}
