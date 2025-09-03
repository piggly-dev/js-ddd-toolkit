import debug from 'debug';

import { TOrUndefined, TOrNull } from '@/types';

import type { DomainErrorHiddenProp, DomainErrorJSON, IDomainError } from './types';

/**
 * @file Base domain error class.
 * @copyright Piggly Lab 2023
 */
export class DomainError implements IDomainError {
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
	 * The extra error data.
	 * Better to add data to client about a response.
	 *
	 * @type {any}
	 * @protected
	 * @readonly
	 * @memberof DomainError
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public readonly extra?: any;

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
		extra?: Record<string, any>,
	) {
		if (extra && typeof extra !== 'object') {
			throw new Error('Extra must be an object.');
		}

		this.name = name;
		this.code = code;
		this.message = message ?? '';
		this.status = status ?? 500;
		this.hint = hint;
		this.extra = extra;
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
		debug('app:inspect')(`PRODUCED ERROR ${this.name} (${this.code})`);

		const object = {
			code: this.code,
			extra: this.extra ?? null,
			hint: this.hint ?? null,
			message: this.message,
			name: this.name,
		};

		if (hidden && hidden.length > 0 && Array.isArray(hidden)) {
			hidden.forEach((prop: DomainErrorHiddenProp) => {
				if (object[prop]) {
					delete object[prop];
				}
			});
		}

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
	public toObject(): { context: TOrNull<Record<string, any>> } & DomainErrorJSON {
		debug('app:inspect')(`PRODUCED ERROR ${this.name} (${this.code})`);

		return {
			code: this.code,
			context: this._context ?? null,
			extra: this.extra ?? null,
			hint: this.hint ?? null,
			message: this.message,
			name: this.name,
		};
	}

	/**
	 * Get the extra data as a typed object.
	 *
	 * @returns {TOrUndefined<T>}
	 * @public
	 * @memberof DomainError
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public typedExtra<T>(): TOrUndefined<T> {
		return this.extra as TOrUndefined<T>;
	}
}
