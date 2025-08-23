import { DomainError } from './errors/DomainError';

/**
 * @file Base result class.
 * @copyright Piggly Lab 2023
 */
export class Result<Data, Error extends DomainError> {
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
	 * Chains a function that returns a Result, supporting sync functions.
	 * If the current Result is successful, applies the function to the data.
	 * If the current Result is a failure, propagates the error without executing the function.
	 *
	 * @template NextData The type of data in the resulting Result
	 * @template NextError The type of error in the resulting Result
	 * @param {(data: Data) => Result<NextData, NextError>} fn Function to apply to the data
	 * @returns {Result<NextData, NextError>} The Result of the chained operation
	 * @public
	 * @memberof Result
	 * @since 4.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public chain<NextData, NextError extends DomainError>(
		fn: (data: Data) => Result<NextData, NextError>,
	): Result<NextData, NextError | Error> {
		if (this.isFailure) {
			return Result.fail(this.error) as Result<NextData, NextError | Error>;
		}

		return fn(this.data);
	}

	/**
	 * Chains a function that returns a Result, supporting async functions.
	 * If the current Result is successful, applies the function to the data.
	 * If the current Result is a failure, propagates the error without executing the function.
	 *
	 * @template NextData The type of data in the resulting Result
	 * @template NextError The type of error in the resulting Result
	 * @param {(data: Data) => Promise<Result<NextData, NextError>>} fn Function to apply to the data
	 * @returns {Promise<Result<NextData, NextError>>} A Promise that resolves to the Result of the chained operation
	 * @public
	 * @memberof Result
	 * @since 4.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public async chainAsync<NextData, NextError extends DomainError>(
		fn: (data: Data) => Promise<Result<NextData, NextError>>,
	): Promise<Result<NextData, NextError | Error>> {
		if (this.isFailure) {
			return Result.fail(this.error) as Result<NextData, NextError | Error>;
		}

		return await fn(this.data);
	}

	/**
	 * Transforms the data of a successful Result using the provided function.
	 * If the Result is a failure, returns the failure unchanged.
	 * The transformation function should not return a Result - the returned value will be wrapped in Result.ok().
	 *
	 * @template NextData The type of the transformed data
	 * @param {(data: Data) => NextData} fn Function to transform the data
	 * @returns {Result<NextData, Error>} A new Result with the transformed data or the original error
	 * @public
	 * @memberof Result
	 * @since 4.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public map<NextData>(fn: (data: Data) => NextData): Result<NextData, Error> {
		if (this.isFailure) {
			return Result.fail(this.error) as Result<NextData, Error>;
		}

		const transformedData = fn(this.data);
		return Result.ok(transformedData);
	}

	/**
	 * Transforms the error of a failed Result using the provided function.
	 * If the Result is successful, returns the success unchanged.
	 * This is useful for converting between different error types or adding context to errors.
	 *
	 * @template NextError The type of the transformed error
	 * @param {(error: Error) => NextError} fn Function to transform the error
	 * @returns {Result<Data, NextError>} A new Result with the original data or the transformed error
	 * @public
	 * @memberof Result
	 * @since 4.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public mapError<NextError extends DomainError>(
		fn: (error: Error) => NextError,
	): Result<Data, NextError> {
		if (this.isSuccess) {
			return Result.ok(this.data);
		}

		const transformedError = fn(this.error);
		return Result.fail(transformedError) as Result<Data, NextError>;
	}

	/**
	 * Executes a side effect function with the data if the Result is successful.
	 * The Result is returned unchanged, making this useful for logging, metrics, or other side effects.
	 * If the Result is a failure, the function is not executed.
	 *
	 * @param {(data: Data) => void} fn Side effect function to execute with the data
	 * @returns {Result<Data, Error>} The original Result unchanged
	 * @public
	 * @memberof Result
	 * @since 4.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public tap(fn: (data: Data) => void): Result<Data, Error> {
		if (this.isSuccess) {
			fn(this.data);
		}

		return this;
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
		error: Error,
	): Result<never, Error> {
		return new Result<never, Error>(false, undefined, error);
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
}
