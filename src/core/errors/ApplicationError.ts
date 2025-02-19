import type { TOrNull, TOrNullable, TOrUndefined } from '@/types';
import { DomainError } from './DomainError';
import type {
	ApplicationErrorJSON,
	DomainErrorHiddenProp,
	DomainErrorJSON,
	IApplicationError,
	PreviousError,
	PreviousErrorJSON,
} from './types';

/**
 * @file Abstract application error class.
 * @copyright Piggly Lab 2024
 */
export abstract class ApplicationError
	extends DomainError
	implements IApplicationError
{
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
	protected _is: Array<string> = ['ApplicationError', 'DomainError'];

	/**
	 * The previous error.
	 *
	 * @type {PreviousError}
	 * @protected
	 * @memberof ApplicationError
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public previous?: PreviousError;

	/**
	 * Create a new error.
	 *
	 * @param {string} name The name of the error.
	 * @param {string} message The message of the error.
	 * @param {PreviousError | undefined} previous The previous error.
	 * @public
	 * @constructor
	 * @memberof ApplicationError
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(
		name: string,
		code: number,
		message: string,
		status: number,
		hint?: string,
		extra?: Record<string, any>,
		previous?: PreviousError
	) {
		super(name, code, message, status, hint, extra);
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
	 * Get the object representation of the error.
	 * Will hide the properties defined in the `hidden` array.
	 * Also it will always hide the previous error.
	 *
	 * @returns {DomainErrorJSON}
	 * @public
	 * @memberof ApplicationError
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public toJSON(hidden: Array<DomainErrorHiddenProp>): DomainErrorJSON {
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
	 * Get the object representation of the error.
	 *
	 * @returns {ApplicationErrorObject}
	 * @public
	 * @memberof ApplicationError
	 * @since 3.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public toObject(): ApplicationErrorJSON & {
		context: TOrNull<Record<string, any>>;
	} {
		return {
			code: this.code,
			name: this.name,
			message: this.message,
			hint: this.hint ?? null,
			extra: this.extra ?? null,
			context: this._context ?? null,
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
			if (this.previous instanceof ApplicationError) {
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
}
