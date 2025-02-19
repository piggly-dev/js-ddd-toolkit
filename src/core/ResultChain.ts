import { TOrUndefined } from '@/types';
import { DomainError } from './errors/DomainError';
import { Result } from './Result';
import { ResultFn } from './types';

/**
 * @file Base result  chainclass.
 * @copyright Piggly Lab 2025
 */
export class ResultChain {
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
	 * Last result.
	 *
	 * @type {Result<any, DomainError>}
	 * @protected
	 * @readonly
	 * @memberof ResultChain
	 * @since 3.2.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _last?: Result<any, DomainError>;

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
	 * Check if the chain has finished.
	 *
	 * @returns {boolean}
	 * @public
	 * @memberof ResultChain
	 * @since 3.2.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public hasFinished(): boolean {
		return this._last !== undefined;
	}

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
		this._last = undefined;

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
	public chain<Data = any, Last = any, Error extends DomainError = DomainError>(
		key: string,
		fn: ResultFn<Data, Last, Error>
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
	 * Get a result from the chain.
	 *
	 * @param {string} key
	 * @returns {TOrUndefined<Result<Data, Error>>}
	 * @public
	 * @memberof ResultChain
	 * @since 3.2.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public resultFor<Data, Error extends DomainError = DomainError>(
		key: string
	): TOrUndefined<Result<Data, Error>> {
		return this._results?.get(key) as TOrUndefined<Result<Data, Error>>;
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
	public async run<Data, Error extends DomainError = DomainError>(): Promise<
		Result<Data, Error>
	> {
		if (!this.isInitialized()) {
			throw new Error('ResultChain not initialized.');
		}

		if (this.hasFinished()) {
			throw new Error('ResultChain already finished. Restart the chain.');
		}

		this._last = undefined;

		/* eslint-disable no-restricted-syntax */
		for (const [key, fn] of this._chain?.entries() ?? []) {
			/* eslint-disable no-await-in-loop */
			this._last = await Promise.resolve(fn(this._last));
			this._results?.set(key, this._last);

			if (this._last.isFailure) {
				return this._last as Result<never, Error>;
			}
		}

		return this._last as Result<Data, Error>;
	}
}
