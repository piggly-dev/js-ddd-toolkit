import fs, { WriteStream } from 'fs';
import path from 'path';

import debug from 'debug';

import type { IFileLogService } from '@/core/services/types/index.js';

import {
	FileLogStreamServiceSettingsSchema,
	FileLogStreamServiceSettings,
	FileLogStreamServiceEntry,
	LogLevel,
} from '@/core/services/schemas';
import { ApplicationService } from '@/core/ApplicationService.js';

/**
 * @file FileLogStreamService.
 * @copyright Piggly Lab 2025
 * @since 4.1.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class FileLogStreamService
	extends ApplicationService
	implements IFileLogService
{
	/**
	 * The number of errors detected.
	 *
	 * @type {number}
	 * @protected
	 * @memberof FileLogStreamService
	 * @since 4.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _errors: number;

	/**
	 * The pending messages for each level.
	 *
	 * @type {Map<LogLevel, Array<string>>}
	 * @protected
	 * @memberof FileLogStreamService
	 * @since 4.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _pending: Map<LogLevel, Array<string>>;

	/**
	 * The settings.
	 *
	 * @type {FileLogStreamServiceSettings}
	 * @protected
	 * @memberof FileLogStreamService
	 * @since 4.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _settings: FileLogStreamServiceSettings;

	/**
	 * The streams for each level.
	 *
	 * @type {Map<LogLevel, WriteStream>}
	 * @protected
	 * @memberof FileLogStreamService
	 * @since 4.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _streams: Map<LogLevel, WriteStream>;

	/**
	 * Constructor.
	 *
	 * - settings: The settings for the file log stream service.
	 *   - abspath: The path to the file to log to. If not set, the logger will not log to a file.
	 *   - killOnLimit: If true, will kill the process if the limit is reached.
	 *   - levels: The levels to log to.
	 *   - streamLimit: The limit of pending messages for each stream.
	 *
	 * @param {FileLogStreamServiceSettings} settings
	 * @public
	 * @memberof FileLogStreamService
	 * @throws {ZodError} If settings are invalid.
	 * @since 4.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public constructor(settings: FileLogStreamServiceEntry) {
		super();

		this._settings = FileLogStreamServiceSettingsSchema.parse(settings);

		this._pending = new Map();
		this._streams = new Map();
		this._errors = 0;

		for (const level of this._settings.levels) {
			this.createStream(this._settings.abspath, level);
		}
	}

	/**
	 * Cleanup the service.
	 *
	 * @returns {void}
	 * @public
	 * @memberof FileLogStreamService
	 * @since 4.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public cleanup(): void {
		for (const level of this._settings.levels) {
			this.flush(level);
			this._pending.delete(level);
		}

		for (const [level, stream] of this._streams.entries()) {
			stream.end(() => {
				debug(`logger:stream:end`)(level);
			});
		}
	}

	/**
	 * Flush the pending messages for a given level.
	 *
	 * @param {LogLevel} level
	 * @returns {void}
	 * @public
	 * @memberof FileLogStreamService
	 * @since 4.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public flush(level: LogLevel): void {
		const pending = this._pending.get(level);

		if (!pending) {
			return;
		}

		while (pending.length > 0) {
			const message = pending.shift();

			if (!message) {
				continue;
			}

			const stream = this._streams.get(level);

			if (!stream) {
				pending.unshift(message);
				continue;
			}

			if (stream.write(message) === false) {
				pending.unshift(message);
				break;
			}
		}

		if (pending.length === 0) {
			this._pending.delete(level);
		}
	}

	/**
	 * Log a message.
	 *
	 * @param {LogLevel} level
	 * @param {string} message
	 * @returns {void}
	 * @public
	 * @memberof FileLogStreamService
	 * @since 4.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public log(level: LogLevel, message: string): void {
		if (!this._settings.levels.includes(level)) {
			return;
		}

		const stream = this._streams.get(level);

		if (stream && stream.write(message) !== false) {
			return;
		}

		if (this._pending.has(level)) {
			if (this._pending.get(level)!.length >= this._settings.streamLimit) {
				/* eslint-disable no-console */
				console.warn(
					`[FileLogStreamService] Stream limit reached for level ${level}, message discarded`,
				);

				if (this._settings.killOnLimit) {
					debug('logger:stream')(
						`❌ Stream limit reached for level ${level}, killing process`,
					);

					process.kill(process.pid, 'SIGTERM');
				}

				return;
			}

			this._pending.get(level)!.push(message);
			return;
		}

		this._pending.set(level, [message]);
	}

	/**
	 * Create a stream for a given level.
	 *
	 * @param {string} abspath
	 * @param {LogLevel} level
	 * @returns {void}
	 * @protected
	 * @memberof FileLogStreamService
	 * @since 4.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected createStream(abspath: string, level: LogLevel): void {
		if (this._streams.has(level)) {
			return;
		}

		const stream = fs.createWriteStream(path.join(abspath, `${level}.log`), {
			flags: 'a',
		});

		stream.on('error', error => {
			debug(`logger:stream:error`)(error);

			this._streams.delete(level);
			this._errors++;

			if (this._errors >= this._settings.errorThreshold) {
				debug('logger:stream')(
					`❌ Error threshold reached for level ${level}, killing process`,
				);

				process.kill(process.pid, 'SIGTERM');
				return;
			}

			this.createStream(abspath, level);
			this.flush(level);
		});

		stream.on('drain', () => {
			debug(`logger:stream:drain`)(level);

			this.flush(level);
		});

		this._streams.set(level, stream);
	}
}
