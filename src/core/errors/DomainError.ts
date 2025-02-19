import { TOrNull } from '@/types';
import type { DomainErrorHiddenProp, DomainErrorJSON, IDomainError } from './types';

/**
 * @file Base domain error class.
 * @copyright Piggly Lab 2023
 */
export class DomainError implements IDomainError {
	/**
	 * The error class name.
	 *
	 * @type {Array<string>}
	 * @public
	 * @readonly
	 * @memberof DomainError
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _is: Array<string> = ['DomainError'];

	/**
	 * The error name.
	 *
	 * @type {string}
	 * @public
	 * @readonly
	 * @memberof DomainError
	 * @since 3.0.0
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
	 * @since 3.0.0
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
	 * @since 3.0.0
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
	 * @since 3.0.0
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
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public readonly hint?: string;

	/**
	 * The extra error data.
	 * Better to add data to client about a response.
	 *
	 * @type {Record<string, any>}
	 * @protected
	 * @readonly
	 * @memberof DomainError
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public readonly extra?: Record<string, any>;

	/**
	 * The error context.
	 * Better to add data to inspect response.
	 *
	 * @type {Record<string, any>}
	 * @protected
	 * @readonly
	 * @memberof DomainError
	 * @since 3.2.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _context?: Record<string, any>;

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
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public constructor(
		name: string,
		code: number,
		message?: string,
		status?: number,
		hint?: string,
		extra?: Record<string, any>
	) {
		if (extra && typeof extra !== 'object') {
			throw new Error('Extra must be an object.');
		}

		this.name = name;
		this.code = code;
		this.message = message ?? '';
		this.status = status ?? 500;
		this.hint = hint;
		this.extra = extra !== undefined ? Object.freeze(extra) : undefined;
	}

	/**
	 * Get the object representation of the error.
	 * Will hide the properties defined in the `hidden` array.
	 *
	 * @returns {DomainErrorJSON}
	 * @public
	 * @memberof DomainError
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public toJSON(hidden: Array<DomainErrorHiddenProp> = []): DomainErrorJSON {
		const object = {
			code: this.code,
			name: this.name,
			message: this.message,
			hint: this.hint ?? null,
			extra: this.extra ?? null,
		};

		hidden.forEach(prop => {
			delete object[prop];
		});

		return object;
	}

	/**
	 * Get the object representation of the error.
	 *
	 * @returns {DomainErrorJSON}
	 * @public
	 * @memberof DomainError
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public toObject(): DomainErrorJSON & { context: TOrNull<Record<string, any>> } {
		return {
			code: this.code,
			name: this.name,
			message: this.message,
			hint: this.hint ?? null,
			extra: this.extra ?? null,
			context: this._context ?? null,
		};
	}

	/**
	 * Check if the error is an instance of the given class.
	 *
	 * @param {string} class_name
	 * @returns {boolean}
	 * @public
	 * @memberof DomainError
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public is(class_name: string): boolean {
		return this._is.includes(class_name);
	}
}
