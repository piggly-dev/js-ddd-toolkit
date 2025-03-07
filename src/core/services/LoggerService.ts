/* eslint-disable no-console */
import type { LoggerServiceSettings } from './types';

import { ServiceProvider } from '../ServiceProvider';

/**
 * @file Logger service.
 * @copyright Piggly Lab 2024
 */
export class LoggerService {
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
	 * @public
	 * @constructor
	 * @memberof LoggerService
	 * @since 4.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(settings: Partial<LoggerServiceSettings> = {}) {
		this._settings = {
			alwaysOnConsole: settings.alwaysOnConsole ?? false,
			callbacks: settings.callbacks ?? {},
			ignoreUnset: settings.ignoreUnset ?? true,
			onFlush: settings.onFlush,
		};
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

		this._settings.onFlush().catch(error => {
			if (!this._settings.onError) {
				console.error('LoggerService.UncaughtError', error);
				return;
			}

			this._settings.onError(error);
		});
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
		return this.prepare('onInfo', message, ...args);
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
		return this.prepare('onWarn', message, ...args);
	}

	/**
	 * Prepare the logger.
	 *
	 * @param {'onDebug' | 'onError' | 'onFatal' | 'onInfo' | 'onWarn'} callback
	 * @param {string} message
	 * @param {Record<string, any>} meta
	 * @returns {void}
	 * @protected
	 * @memberof LoggerService
	 * @since 4.0.0
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

		if (!fn) {
			return;
		}

		fn(...args).catch(error => {
			if (!this._settings.onError) {
				console.error('LoggerService.UncaughtError', error);
				return;
			}

			this._settings.onError(error);
		});
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

		return new LoggerService({
			alwaysOnConsole: false,
			ignoreUnset: true,
		});
	}
}
