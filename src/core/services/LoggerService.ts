/* eslint-disable no-console */
import debug from 'debug';

import { OnGoingPromisesService } from '@/core/services/OnGoingPromisesService';
import { FileLogStreamService } from '@/core/services/FileLogStreamService';
import { displayLog } from '@/utils';

import type { LoggerServiceSettings, LogLevel } from './types';

import { ServiceProvider } from '../ServiceProvider';

/**
 * @file Logger service.
 * @copyright Piggly Lab 2024
 */
export class LoggerService {
	/**
	 * The file log stream service.
	 *
	 * @type {FileLogStreamService}
	 * @protected
	 * @memberof LoggerService
	 * @since 4.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _file?: FileLogStreamService;

	/**
	 * Ongoing promises.
	 *
	 * @type {OnGoingPromisesService}
	 * @protected
	 * @memberof LoggerService
	 * @since 4.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _ongoing: OnGoingPromisesService;

	/**
	 * Settings.
	 *
	 * @type {LoggerServiceSettings}
	 * @protected
	 * @memberof LoggerService
	 * @since 4.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _settings: LoggerServiceSettings;

	/**
	 * Constructor.
	 *
	 * - alwaysOnConsole: Will display logs on console.
	 * - callbacks: Custom logger functions:
	 *   - onDebug: Debug logger.
	 *   - onError: Error logger.
	 *   - onFatal: Fatal logger.
	 *   - onInfo: Info logger.
	 *   - onWarn: Warn logger.
	 * - ignoreUnset: When true, will not throw an error if a callback is not set.
	 * - ignoreLevels: The logger service will ignore any log level set here.
	 * - onError: Custom error handler.
	 * - onFlush: Custom flush handler. Should be used to flush logs.
	 * - file: How to handle file logging
	 *   - abspath: The path to the file to log to. If not set, the logger will not log to a file.
	 *   - killOnLimit: If true, will kill the process if the limit is reached.
	 *   - levels: The levels to log to.
	 *   - streamLimit: The limit of pending messages for each stream.
	 * - promises: How to handle promises
	 *   - killOnLimit: If true, will kill the process if the limit is reached.
	 *   - limit: The limit of ongoing promises.
	 *   - track: The callbacks to track.
	 *
	 * @public
	 * @constructor
	 * @memberof LoggerService
	 * @since 4.0.0
	 * @since 4.1.0 Added ignoreLevels, trackOnGoing.
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public constructor(settings: Partial<LoggerServiceSettings> = {}) {
		this._settings = {
			alwaysOnConsole: settings.alwaysOnConsole ?? false,
			callbacks: settings.callbacks ?? {},
			file: settings.file,
			ignoreLevels: settings.ignoreLevels ?? [],
			ignoreUnset: settings.ignoreUnset ?? true,
			onError: settings.onError,
			onFlush: settings.onFlush,
			promises: settings.promises ?? { track: ['onError', 'onFatal'] },
		};

		this._ongoing = new OnGoingPromisesService(
			this._settings.promises.limit,
			this._settings.promises.killOnLimit,
		);

		if (this._settings.file) {
			this._file = new FileLogStreamService(
				this._settings.file.abspath,
				this._settings.file.levels,
				this._settings.file.streamLimit,
				this._settings.file.killOnLimit,
			);
		}
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
	 * @memberof LoggerService
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public async cleanup(): Promise<void> {
		debug('logger:cleanup')('cleaning up');
		await this._ongoing.cleanup();

		if (this._file) {
			this._file.cleanup();
		}

		debug('logger:cleanup')('cleaned up');
	}

	/**
	 * Debug.
	 *
	 * @param {string} message
	 * @param {Record<string, any>} meta
	 * @returns {void}
	 * @protected
	 * @memberof LoggerService
	 * @since 4.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public debug(message?: string, ...args: any[]): void {
		if (this._settings.ignoreLevels.includes('debug')) {
			return;
		}

		this.onFileLog('debug', message, ...args);
		return this.prepare('onDebug', message, ...args);
	}

	/**
	 * Error.
	 *
	 * @param {string} message
	 * @param {Record<string, any>} meta
	 * @returns {void}
	 * @protected
	 * @memberof LoggerService
	 * @since 4.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public error(message?: string, ...args: any[]): void {
		if (this._settings.ignoreLevels.includes('error')) {
			return;
		}

		this.onFileLog('error', message, ...args);
		return this.prepare('onError', message, ...args);
	}

	/**
	 * Fatal.
	 *
	 * @param {string} message
	 * @param {Record<string, any>} meta
	 * @returns {void}
	 * @protected
	 * @memberof LoggerService
	 * @since 4.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public fatal(message?: string, ...args: any[]): void {
		if (this._settings.ignoreLevels.includes('fatal')) {
			return;
		}

		this.onFileLog('fatal', message, ...args);
		return this.prepare('onFatal', message, ...args);
	}

	/**
	 * Flush the logger.
	 *
	 * @returns {void}
	 * @protected
	 * @memberof LoggerService
	 * @since 4.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public flush(): void {
		if (!this._settings.onFlush) {
			return;
		}

		if (this._settings.promises.track.includes('onFlush') === false) {
			this._settings.onFlush().catch(error => {
				if (!this._settings.onError) {
					console.error('LOGGER/UNCAUGHT_ERROR', error);
					debug(`logger:uncaught`)(error);
					return;
				}

				this._settings.onError(error);
			});

			return;
		}

		this._ongoing.register(
			this._settings.onFlush().catch(error => {
				if (!this._settings.onError) {
					console.error('LOGGER/UNCAUGHT_ERROR', error);
					debug(`logger:uncaught`)(error);
					return;
				}

				this._settings.onError(error);
			}),
		);
	}

	/**
	 * Info.
	 *
	 * @param {string} message
	 * @param {Record<string, any>} meta
	 * @returns {void}
	 * @protected
	 * @memberof LoggerService
	 * @since 4.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public info(message?: string, ...args: any[]): void {
		if (this._settings.ignoreLevels.includes('info')) {
			return;
		}

		this.onFileLog('info', message, ...args);
		return this.prepare('onInfo', message, ...args);
	}

	/**
	 * Wait for a given amount of milliseconds.
	 *
	 * @param {number} ms
	 * @returns {Promise<void>}
	 * @public
	 * @memberof LoggerService
	 * @since 4.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public wait(ms: number): Promise<void> {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	/**
	 * Warn.
	 *
	 * @param {string} message
	 * @param {Record<string, any>} meta
	 * @returns {void}
	 * @protected
	 * @memberof LoggerService
	 * @since 4.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public warn(message?: string, ...args: any[]): void {
		if (this._settings.ignoreLevels.includes('warn')) {
			return;
		}

		this.onFileLog('warn', message, ...args);
		return this.prepare('onWarn', message, ...args);
	}

	/**
	 * Log to file.
	 *
	 * @param {LogLevel} level
	 * @param {string} message
	 * @param {any[]} args
	 * @protected
	 * @memberof LoggerService
	 * @since 4.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected onFileLog(level: LogLevel, message?: string, ...args: any[]): void {
		if (this._file) {
			this._file.log(
				level,
				displayLog(level, message ?? 'Unknown log', args).message,
			);
		}
	}

	/**
	 * Prepare the logger.
	 *
	 * @param {'onDebug' | 'onError' | 'onFatal' | 'onInfo' | 'onWarn'} callback
	 * @param {any[]} args
	 * @returns {void}
	 * @protected
	 * @memberof LoggerService
	 * @since 4.0.0
	 * @since 4.1.0 Added uncaught error handler.
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected prepare(
		callback: 'onDebug' | 'onError' | 'onFatal' | 'onInfo' | 'onWarn',
		...args: any[]
	): void {
		const fn = this._settings.callbacks[callback];

		if (!fn) {
			if (this._settings.ignoreUnset) {
				return;
			}

			throw new Error(
				`No debug logger function set for callback ${callback}, implement one or enable ignoreUnset config`,
			);
		}

		if (this._settings.alwaysOnConsole) {
			switch (callback) {
				case 'onDebug':
					console.debug(...args);
					break;
				case 'onError':
					console.error(...args);
					break;
				case 'onInfo':
					console.info(...args);
					break;
				case 'onWarn':
					console.warn(...args);
					break;
				default:
					console.log(...args);
			}
		}

		debug(`logger:${callback}`)(args);

		if (this._settings.promises.track.includes(callback) === false) {
			fn(...args).catch(error => {
				if (!this._settings.onError) {
					console.error('LOGGER/UNCAUGHT_ERROR', error);
					debug(`logger:uncaught`)(error);
					return;
				}

				this._settings.onError(error);
			});

			return;
		}

		this._ongoing.register(
			fn(...args).catch(error => {
				if (!this._settings.onError) {
					console.error('LOGGER/UNCAUGHT_ERROR', error);
					debug(`logger:uncaught`)(error);
					return;
				}

				this._settings.onError(error);
			}),
		);
	}

	/**
	 * Register application service.
	 *
	 * @param {LoggerService} service
	 * @public
	 * @static
	 * @memberof LoggerService
	 * @since 4.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static register(service: LoggerService): void {
		if (ServiceProvider.has('LoggerService')) {
			return;
		}

		ServiceProvider.register('LoggerService', service);
	}

	/**
	 * Resolve application service.
	 *
	 * @returns {LoggerService}
	 * @throws {Error} If service is not registered.
	 * @public
	 * @static
	 * @memberof LoggerService
	 * @since 4.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static resolve(): LoggerService {
		return ServiceProvider.resolve('LoggerService');
	}

	/**
	 * Soft resolve application service.
	 * This method will not throw an error if the service is not registered.
	 * It will return a new instance of the service with the ignoreUnset config set to true.
	 *
	 * @returns {LoggerService}
	 * @public
	 * @static
	 * @memberof LoggerService
	 * @since 4.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static softResolve(): LoggerService {
		if (ServiceProvider.has('LoggerService')) {
			return ServiceProvider.resolve('LoggerService');
		}

		// @note it will not log anything
		return new LoggerService({
			alwaysOnConsole: false,
			ignoreLevels: ['debug', 'info', 'warn', 'error', 'fatal'],
			ignoreUnset: true,
			promises: { track: [] },
		});
	}
}
