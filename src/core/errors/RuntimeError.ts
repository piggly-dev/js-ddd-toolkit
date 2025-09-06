import debug from 'debug';

import type {
	DomainErrorHiddenProp,
	ApplicationErrorJSON,
	PreviousErrorJSON,
	DomainErrorJSON,
	IRuntimeError,
	PreviousError,
} from '@/core/errors/types/index.js';
import type { TOrUndefined, TOrNullable, TOrNull } from '@/types/index.js';

import { DomainError } from '@/core/errors/DomainError.js';

/**
 * @file Abstract runtime error class.
 * @copyright Piggly Lab 2024
 */
export class RuntimeError extends Error implements IRuntimeError {
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
	protected _is: Array<string> = ['RuntimeError'];

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
	 * The extra error data.
	 * Better to add data to client about a response.
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
		previous?: PreviousError,
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
					message: this.previous.message,
					name: this.previous.name,
					stack: this.previous.previousToObject(),
				};
			}

			if (this.previous instanceof DomainError) {
				return {
					message: this.previous.message,
					name: this.previous.name,
					stack: null,
				};
			}

			if (this.previous instanceof Error) {
				return {
					message: this.previous.message ?? null,
					name: this.previous.name,
					stack: this.previous.stack || null,
				};
			}

			return {
				message: this.previous.message ?? null,
				name: this.previous.name,
			};
		}

		return null;
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
		debug('app:inspect')(`PRODUCED ERROR ${this.name} (${this.code})`);

		const object = {
			code: this.code,
			context: this._context ?? null,
			extra: this.extra ?? null,
			hint: this.hint ?? null,
			message: this.message,
			name: this.name,
		};

		if (hidden && hidden.length > 0 && Array.isArray(hidden)) {
			hidden.forEach((key: DomainErrorHiddenProp) => {
				if (object[key]) {
					delete object[key];
				}
			});
		}

		return object;
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
	public toObject(): {
		context: TOrNull<Record<string, any>>;
	} & ApplicationErrorJSON {
		debug('app:inspect')(`PRODUCED ERROR ${this.name} (${this.code})`);

		return {
			code: this.code,
			context: this._context ?? null,
			extra: this.extra ?? null,
			hint: this.hint ?? null,
			message: this.message,
			name: this.name,
			previous: this.previousToObject(),
		};
	}
}
