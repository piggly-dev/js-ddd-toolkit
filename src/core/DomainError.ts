import type { DomainErrorObject } from '../types';

/**
 * @file Base domain error class.
 * @copyright Piggly Lab 2023
 */
export default class DomainError {
	/**
	 * The error name.
	 *
	 * @type {string}
	 * @public
	 * @readonly
	 * @memberof DomainError
	 * @since 2.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public readonly name: string;

	/**
	 * The error message.
	 *
	 * @type {string}
	 * @public
	 * @readonly
	 * @memberof DomainError
	 * @since 2.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public readonly message: string;

	/**
	 * The error internal code.
	 *
	 * @type {number}
	 * @public
	 * @readonly
	 * @memberof DomainError
	 * @since 2.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public readonly code: number;

	/**
	 * The error HTTP status code.
	 *
	 * @type {number}
	 * @public
	 * @readonly
	 * @memberof DomainError
	 * @since 2.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public readonly status: number;

	/**
	 * The error hint.
	 *
	 * @type {string | undefined}
	 * @public
	 * @readonly
	 * @memberof DomainError
	 * @since 2.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public readonly hint?: string;

	/**
	 * The extra error data.
	 *
	 * @type {Record<string, any>}
	 * @protected
	 * @readonly
	 * @memberof DomainError
	 * @since 2.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public readonly extra?: Record<string, any>;

	/**
	 * Creates an instance of DomainError.
	 *
	 * @param {string} name
	 * @param {number} code
	 * @param {string} message
	 * @param {number} status
	 * @param {string} [hint]
	 * @param {Record<string, any>} [extra]
	 * @public
	 * @constructor
	 * @memberof DomainError
	 * @since 2.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public constructor(
		name: string,
		code: number,
		message: string,
		status: number,
		hint?: string,
		extra?: Record<string, any>
	) {
		if (extra && typeof extra !== 'object') {
			throw new Error('Extra must be an object.');
		}

		this.name = name;
		this.code = code;
		this.message = message;
		this.status = status;
		this.hint = hint;
		this.extra = extra !== undefined ? Object.freeze(extra) : undefined;
	}

	/**
	 * Get the object representation of the error.
	 *
	 * @returns {DomainErrorObject}
	 * @public
	 * @memberof DomainError
	 * @since 2.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public toObject(): DomainErrorObject {
		return {
			code: this.code,
			name: this.name,
			message: this.message,
			hint: this.hint ?? null,
			extra: this.extra ?? null,
		};
	}
}
