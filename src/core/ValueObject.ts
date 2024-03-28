import { shallowEqual } from 'shallow-equal-object';

/**
 * @file Base value object class.
 * @copyright Piggly Lab 2023
 * @since 2.0.0 Flexible props
 */
export default class ValueObject<Props = Record<string, any>> {
	/**
	 * The value object props.
	 *
	 * @type {Props}
	 * @protected
	 * @readonly
	 * @memberof ValueObject
	 * @since 1.0.0
	 * @since 2.0.0 Protected props
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected readonly props: Props;

	/**
	 * Creates an instance of ValueObject.
	 * The props are frozen to avoid any change.
	 * You should create a new instance with a static method.
	 *
	 * @param {Props} props
	 * @protected
	 * @constructor
	 * @memberof ValueObject
	 * @since 1.0.0
	 * @since 2.0.0 Protected constructor
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected constructor(props: Props) {
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
