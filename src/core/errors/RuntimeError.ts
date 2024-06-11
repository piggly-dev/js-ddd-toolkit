import type { TOrNullable, TOrUndefined } from '@/types';

import { DomainError } from './DomainError';

import type {
	ApplicationErrorJSON,
	DomainErrorHiddenProp,
	DomainErrorJSON,
	IRuntimeError,
	PreviousError,
	PreviousErrorJSON,
} from './types';

/**
 * @file Abstract runtime error class.
 * @copyright Piggly Lab 2024
 */
export abstract class RuntimeError extends Error implements IRuntimeError {
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
	protected _is: Array<string> = ['RuntimeError'];

	/**
	 * The error name.
	 *
	 * @type {string}
	 * @public
	 * @readonly
	 * @memberof RuntimeError
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public readonly name: string;

	/**
	 * The error internal code.
	 *
	 * @type {number}
	 * @public
	 * @readonly
	 * @memberof RuntimeError
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
	 * @memberof RuntimeError
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
	 * @memberof RuntimeError
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public readonly hint?: string;

	/**
	 * The extra error data.
	 *
	 * @type {Record<string, any>}
	 * @protected
	 * @readonly
	 * @memberof RuntimeError
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public readonly extra?: Record<string, any>;

	/**
	 * The previous error.
	 *
	 * @type {PreviousError}
	 * @protected
	 * @memberof RuntimeError
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public readonly previous?: PreviousError;

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
	 * @memberof RuntimeError
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public constructor(
		name: string,
		code: number,
		message: string,
		status: number,
		hint?: string,
		extra?: Record<string, any>,
		previous?: PreviousError
	) {
		if (extra && typeof extra !== 'object') {
			throw new Error('Extra must be an object.');
		}

		super(message);

		this.name = name;
		this.code = code;
		this.status = status;
		this.hint = hint;
		this.extra = extra !== undefined ? Object.freeze(extra) : undefined;
		this.previous = previous;
	}

	/**
	 * Get the object representation of the error.
	 * Will hide the properties defined in the `hidden` array.
	 * Also it will always hide the previous error.
	 *
	 * @returns {ApplicationErrorJSON}
	 * @public
	 * @memberof RuntimeError
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

		hidden.forEach((key: DomainErrorHiddenProp) => {
			delete object[key];
		});

		return object;
	}

	/**
	 * Get the previous error.
	 *
	 * @returns {PreviousError}
	 * @public
	 * @memberof ApplicationError
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public getPrevious(): TOrUndefined<PreviousError> {
		return this.previous;
	}

	/**
	 * Get the object representation of the error.
	 *
	 * @returns {ApplicationErrorJSON}
	 * @public
	 * @memberof RuntimeError
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public toObject(): ApplicationErrorJSON {
		return {
			code: this.code,
			name: this.name,
			message: this.message,
			hint: this.hint ?? null,
			extra: this.extra ?? null,
			previous: this.previousToObject(),
		};
	}

	/**
	 * Get the previous error as a JSON object.
	 *
	 * @returns {TOrNullable<PreviousErrorJSON>}
	 * @public
	 * @memberof ApplicationError
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public previousToObject(): TOrNullable<PreviousErrorJSON> {
		if (this.previous) {
			if (this.previous instanceof RuntimeError) {
				return {
					name: this.previous.name,
					message: this.previous.message,
					stack: this.previous.previousToObject(),
				};
			}

			if (this.previous instanceof DomainError) {
				return {
					name: this.previous.name,
					message: this.previous.message,
					stack: null,
				};
			}

			if (this.previous instanceof Error) {
				return {
					name: this.previous.name,
					message: this.previous.message ?? null,
					stack: this.previous.stack || null,
				};
			}

			return {
				name: this.previous.name,
				message: this.previous.message ?? null,
			};
		}

		return null;
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
