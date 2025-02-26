import crypto from 'crypto';
import type { IAttribute } from './types';

/**
 * @file Base attribute class.
 * @copyright Piggly Lab 2025
 * @since 3.4.0
 */
export class Attribute<Props extends Record<any, any>> implements IAttribute<Props> {
	/**
	 * The attribute props.
	 *
	 * @type {Props}
	 * @protected
	 * @readonly
	 * @memberof Attribute
	 * @since 3.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected readonly _props: Props;

	/**
	 * Creates an instance of Attribute.
	 * The props are frozen to avoid any change.
	 * You should create a new instance with a static method.
	 *
	 * @param {Props} props
	 * @protected
	 * @constructor
	 * @memberof Attribute
	 * @since 3.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected constructor(props: Props) {
		this._props = props;
	}

	/**
	 * Clone the attribute.
	 *
	 * @returns {Attribute<Props>}
	 * @public
	 * @memberof Attribute
	 * @since 3.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public clone(): Attribute<Props> {
		return new Attribute({ ...this._props });
	}

	/**
	 * Hash the attribute.
	 *
	 * @returns {string}
	 * @public
	 * @memberof Attribute
	 * @since 3.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public hash(): string {
		return crypto
			.createHash('sha256')
			.update(JSON.stringify(this._props))
			.digest('hex');
	}

	/**
	 * Checks if two attributes are equal.
	 *
	 * @param {(Attribute|undefined|null)} [attr]
	 * @returns {boolean}
	 * @public
	 * @memberof Attribute
	 * @since 3.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public equals(attr: IAttribute<Props> | undefined | null): boolean {
		if (attr === null || attr === undefined || !Attribute.isAttribute(attr)) {
			return false;
		}

		return this.hash() === attr.hash();
	}

	/**
	 * Checks if an object is an attribute.
	 *
	 * @param {*} e
	 * @returns {boolean}
	 * @public
	 * @static
	 * @memberof Attribute
	 * @since 3.4.1
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static isAttribute(e: any): boolean {
		return e instanceof Attribute;
	}
}
