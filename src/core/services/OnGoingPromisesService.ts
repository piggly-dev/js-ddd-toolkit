import debug from 'debug';

import {
	OnGoingPromisesServiceSettingsSchema,
	OnGoingPromisesServiceEntry,
} from '@/core/services/schemas';

export class OnGoingPromisesService {
	/**
	 * Kill on limit.
	 *
	 * @type {boolean}
	 * @protected
	 * @memberof OnGoingPromisesService
	 * @since 4.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _killOnLimit: boolean;

	/**
	 * The limit of ongoing promises.
	 *
	 * @type {number}
	 * @protected
	 * @memberof OnGoingPromisesService
	 * @since 4.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _limit: number;

	/**
	 * Ongoing promises.
	 *
	 * @type {Set<Promise<any>>}
	 * @protected
	 * @memberof OnGoingPromisesService
	 * @since 4.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _ongoing: Set<Promise<any>>;

	/**
	 * Constructor.
	 *
	 * @public
	 * @constructor
	 * @memberof OnGoingPromisesService
	 * @throws {ZodError} If settings are invalid.
	 * @since 4.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public constructor(settings: OnGoingPromisesServiceEntry = {}) {
		const options = OnGoingPromisesServiceSettingsSchema.parse(settings);

		this._ongoing = new Set();
		this._limit = options.limit;
		this._killOnLimit = options.killOnLimit;
	}

	/**
	 * Get the number of ongoing promises.
	 *
	 * @returns {number}
	 * @public
	 * @since 4.1.0
	 * @memberof OnGoingPromisesService
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get size(): number {
		return this._ongoing.size;
	}

	/**
	 * The cleanup method will:
	 *
	 * - Wait for all pending promises triggered by send method.
	 * - Clear the pool of pending promises.
	 *
	 * Useful for:
	 *
	 * - Flush pool of pending promises.
	 * - Ensure all promises are settled.
	 * - Gracefully shutdown your application.
	 *
	 * @returns {Promise<void>}
	 * @public
	 * @since 4.1.0
	 * @memberof OnGoingPromisesService
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public async cleanup(): Promise<void> {
		debug('ongoing:cleanup')('cleaning up');
		await Promise.allSettled(this._ongoing);
		this._ongoing = new Set();
		debug('ongoing:cleanup')('cleaned up');
	}

	/**
	 * Register a promise.
	 *
	 * @param {Promise<any>} promise
	 * @public
	 * @since 4.1.0
	 * @memberof OnGoingPromisesService
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public register(promise: Promise<any>): void {
		if (this._ongoing.size >= this._limit) {
			/* eslint-disable no-console */
			console.warn(
				`[OnGoingPromisesService] Limit of ${this._limit} ongoing promises reached, promise discarded`,
			);

			if (this._killOnLimit) {
				debug('ongoing:kill')(
					`❌ Limit of ${this._limit} ongoing promises reached, killing process`,
				);

				process.kill(process.pid, 'SIGTERM');
			}

			return;
		}

		this._ongoing.add(promise);
		debug('ongoing:register')(`registered promise; pool: ${this._ongoing.size}`);

		promise.finally(() => {
			this._ongoing.delete(promise);
			debug('ongoing:register')(`removed promise; pool: ${this._ongoing.size}`);
		});
	}
}
