import { DomainError } from './errors/DomainError';

/**
 * @file Base result class.
 * @copyright Piggly Lab 2023
 */
export class Result<Data, Error extends DomainError> {
	/**
	 * Success flag.
	 *
	 * @type {boolean}
	 * @protected
	 * @readonly
	 * @memberof Result
	 * @since 2.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public readonly isSuccess: boolean;

	/**
	 * Available data when successful.
	 *
	 * @type {Data}
	 * @protected
	 * @readonly
	 * @memberof Result
	 * @since 2.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	private readonly _data?: Data;

	/**
	 * Available error when failed.
	 *
	 * @type {Data}
	 * @protected
	 * @readonly
	 * @memberof Result
	 * @since 2.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	private readonly _error?: DomainError;

	/**
	 * Creates a new result.
	 *
	 * @param {boolean} isSuccess
	 * @param {Data} [data]
	 * @param {Error} [error]
	 * @private
	 * @constructor
	 * @memberof Result
	 * @since 2.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	private constructor(isSuccess: boolean, data?: Data, error?: Error) {
		if (error && error instanceof DomainError === false) {
			throw new Error('Error must be an instance of DomainError.');
		}

		this.isSuccess = isSuccess;
		this._data = data;
		this._error = error;
	}

	/**
	 * Checks if the result is a failure.
	 *
	 * @returns {boolean}
	 * @public
	 * @memberof Result
	 * @since 2.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get isFailure(): boolean {
		return !this.isSuccess;
	}

	/**
	 * Get the data of the result.
	 *
	 * @public
	 * @memberof Result
	 * @since 2.0.0
	 * @throws {Error} Cannot retrieve data of failed result.
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get data() {
		if (this.isFailure) {
			throw new Error('Cannot retrieve data of failed result.');
		}

		return this._data as Data;
	}

	/**
	 * Get the error of the result.
	 *
	 * @public
	 * @memberof Result
	 * @since 2.0.0
	 * @throws {Error} Cannot retrieve error of successful result.
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get error() {
		if (this.isSuccess) {
			throw new Error('Cannot retrieve error of successful result.');
		}

		return this._error as Error;
	}

	/**
	 * Creates a new successful result.
	 *
	 * @static
	 * @template Success
	 * @param {Success} data
	 * @returns {Result<Success, never>}
	 * @public
	 * @memberof Result
	 * @since 2.0.0
	 */
	public static ok<Success>(data: Success): Result<Success, never> {
		return new Result<Success, never>(true, data);
	}

	/**
	 * Creates a new failed result.
	 *
	 * @static
	 * @template Error
	 * @param {Error} error
	 * @returns {Result<never, Error>}
	 * @public
	 * @memberof Result
	 * @since 2.0.0
	 */
	public static fail<Error extends DomainError>(
		error: Error
	): Result<never, DomainError> {
		return new Result<never, DomainError>(false, undefined, error);
	}
}
