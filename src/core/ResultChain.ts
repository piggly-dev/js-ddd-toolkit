import { DomainError } from './errors/DomainError';
import { ResultFn } from './types';
import { Result } from './Result';

/**
 * @file Base result  chainclass.
 * @copyright Piggly Lab 2025
 */
export class ResultChain {
	/**
	 * Check if the chain has been canceled.
	 *
	 * @protected
	 * @readonly
	 * @memberof ResultChain
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _cancel = false;

	/**
	 * Collection of functions to be executed.
	 *
	 * @type {Map<string, ResultFn<any, any, DomainError>>}
	 * @protected
	 * @readonly
	 * @memberof ResultChain
	 * @since 3.2.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _chain?: Map<string, ResultFn<any, any, DomainError>>;

	/**
	 * Check if the chain has been executed.
	 *
	 * @protected
	 * @readonly
	 * @memberof ResultChain
	 * @since 3.2.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _executed = false;

	/**
	 * Last result.
	 *
	 * @type {Result<any, DomainError>}
	 * @protected
	 * @readonly
	 * @memberof ResultChain
	 * @since 3.2.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _last: Result<any, DomainError> = Result.ok(false);

	/**
	 * Collection of successful results.
	 *
	 * @type {Map<string, Result<any, DomainError>>}
	 * @protected
	 * @readonly
	 * @memberof ResultChain
	 * @since 3.2.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _results?: Map<string, Result<any, DomainError>>;

	/**
	 * Begin the chain.
	 *
	 * @returns {ResultChain}
	 * @public
	 * @memberof ResultChain
	 * @since 3.2.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public begin(): ResultChain {
		this._results = new Map();
		this._chain = new Map();
		this._last = Result.okVoid();
		this._executed = false;
		this._cancel = false;

		return this;
	}

	/**
	 * The next chain will never be executed.
	 * Will for run method to return immediately the last result.
	 *
	 * @returns {ResultChain}
	 * @public
	 * @memberof ResultChain
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public cancel(): ResultChain {
		this._cancel = true;
		return this;
	}

	/**
	 * Add a function to the chain.
	 *
	 * @param {string} key
	 * @param {ResultFn<Data, Last, Error>} fn
	 * @returns {this}
	 * @public
	 * @memberof ResultChain
	 * @since 3.2.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public chain<PrevData, NextData, NextError extends DomainError = DomainError>(
		key: string,
		fn: ResultFn<PrevData, NextData, NextError>,
	): this {
		if (!this.isInitialized()) {
			throw new Error('ResultChain not initialized.');
		}

		if (this.hasFinished()) {
			throw new Error('ResultChain already finished. Restart the chain.');
		}

		this._chain?.set(key, fn as any);
		return this;
	}

	/**
	 * Check if the chain has finished.
	 *
	 * @returns {boolean}
	 * @public
	 * @memberof ResultChain
	 * @since 3.2.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public hasFinished(): boolean {
		return this._executed;
	}

	/**
	 * Check if the chain is initialized.
	 *
	 * @returns {boolean}
	 * @public
	 * @memberof ResultChain
	 * @since 3.2.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public isInitialized(): boolean {
		return this._results !== undefined && this._chain !== undefined;
	}

	/**
	 * Get a result from the chain.
	 *
	 * @param {string} key
	 * @returns {TOrUndefined<Result<Data, Error>>}
	 * @public
	 * @memberof ResultChain
	 * @since 3.2.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public resultFor<ResponseData, ResponseError extends DomainError = DomainError>(
		key: string,
	): Result<ResponseData, ResponseError> {
		if (!this._results || !this._results.has(key)) {
			throw new Error(
				`Result for key "${key}" is not available. Did you forget to run the chain?`,
			);
		}

		return this._results.get(key)! as Result<ResponseData, ResponseError>;
	}

	/**
	 * Run the chain.
	 *
	 * @returns {Promise<Result<Data, Error>>}
	 * @public
	 * @memberof ResultChain
	 * @since 3.2.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public async run<
		ResponseData,
		ResponseError extends DomainError = DomainError,
	>(): Promise<Result<ResponseData, ResponseError>> {
		if (!this.isInitialized()) {
			throw new Error('ResultChain not initialized.');
		}

		if (this.hasFinished()) {
			throw new Error('ResultChain already finished. Restart the chain.');
		}

		for (const [key, fn] of this._chain?.entries() ?? []) {
			this._last = await Promise.resolve(fn(this._last));
			this._results?.set(key, this._last);

			if (this._cancel) {
				this._cancel = false;
				return this._last as Result<ResponseData, ResponseError>;
			}

			if (this._last.isFailure) {
				return this._last as Result<never, ResponseError>;
			}
		}

		this._executed = true;
		return this._last as Result<ResponseData, ResponseError>;
	}

	/**
	 * Create a new result chain.
	 * It will automatically begin the chain.
	 *
	 * @returns {ResultChain}
	 * @public
	 * @memberof ResultChain
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static do(): ResultChain {
		const chain = new ResultChain();
		chain.begin();

		return chain;
	}
}
