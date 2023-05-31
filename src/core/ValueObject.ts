import { shallowEqual } from 'shallow-equal-object';

/**
 * @file Base value object class.
 * @copyright Piggly Lab 2023
 */
export default class ValueObject<Props extends Record<string, any>> {
	/**
	 * The value object props.
	 *
	 * @type {Props}
	 * @protected
	 * @readonly
	 * @memberof ValueObject
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public readonly props: Props;

	/**
	 * Creates an instance of ValueObject.
	 *
	 * @param {Props} props
	 * @public
	 * @constructor
	 * @memberof ValueObject
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(props: Props) {
		this.props = Object.freeze(props);
	}

	/**
	 * Checks if two value objects are equal.
	 *
	 * @param {(ValueObject|undefined|null)} [vo]
	 * @returns {boolean}
	 * @public
	 * @memberof ValueObject
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public equals(vo: ValueObject<Props> | undefined | null): boolean {
		if (vo === null || vo === undefined) {
			return false;
		}

		if (!(vo instanceof this.constructor)) {
			return false;
		}

		return shallowEqual(this.props, vo.props);
	}
}
