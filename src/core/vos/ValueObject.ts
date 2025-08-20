import crypto from 'node:crypto';

import { shallowEqual } from 'shallow-equal-object';

import type { IValueObject } from '@/core/types/index.js';

/**
 * @file Base value object class.
 * @copyright Piggly Lab 2023
 * @since 2.0.0 Flexible props
 */
export class ValueObject<Props extends Record<string, any> = Record<string, any>>
	implements IValueObject<Props>
{
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
	protected readonly _props: Props;

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
		this._props = Object.freeze(props);
	}

	/**
	 * Get the value object props.
	 *
	 * @returns {Props}
	 * @public
	 * @memberof ValueObject
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get props(): Props {
		return this._props;
	}

	/**
	 * Clone the attribute.
	 *
	 * @returns {Attribute<Props>}
	 * @public
	 * @memberof Attribute
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public clone(): ValueObject<Props> {
		return new ValueObject({ ...this._props });
	}

	/**
	 * Checks if two value objects are equal.
	 *
	 * @param {(ValueObject|undefined|null)} [vo]
	 * @returns {boolean}
	 * @public
	 * @memberof ValueObject
	 * @since 1.0.0
	 * @since 3.0.0 Remove class constructor checking
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public equals(vo: IValueObject<Props> | undefined | null): boolean {
		if (vo === null || vo === undefined || vo.is('valueobject') === false) {
			return false;
		}

		if (vo.hash() === this.hash()) {
			return true;
		}

		return shallowEqual(this._props, vo.props);
	}

	/**
	 * Hash the value object.
	 *
	 * @returns {string}
	 * @public
	 * @memberof ValueObject
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public hash(): string {
		return crypto
			.createHash('sha256')
			.update(JSON.stringify(this._props))
			.digest('hex');
	}

	/**
	 * Checks if the object is a specific component type.
	 *
	 * @param {string} name
	 * @returns {boolean}
	 * @public
	 * @memberof ValueObject
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public is(name: string): boolean {
		return name === 'valueobject';
	}
}
