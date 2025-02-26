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
	protected readonly props: Props;

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
		this.props = props;
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
		return new Attribute({ ...this.props });
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
			.update(JSON.stringify(this.props))
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
		if (attr === null || attr === undefined) {
			return false;
		}

		return this.hash() === attr.hash();
	}
}
