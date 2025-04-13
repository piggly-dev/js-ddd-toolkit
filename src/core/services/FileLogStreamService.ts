import fs, { WriteStream } from 'fs';
import path from 'path';

import debug from 'debug';

import { LogLevel } from '@/core/services/types';

/**
 * @file FileLogStreamService.
 * @copyright Piggly Lab 2025
 * @since 4.1.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class FileLogStreamService {
	/**
	 * The abspath to the log files.
	 *
	 * @type {string}
	 * @protected
	 * @memberof FileLogStreamService
	 * @since 4.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _abspath: string;

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
	 * The levels to log to.
	 *
	 * @type {Array<LogLevel>}
	 * @protected
	 * @memberof FileLogStreamService
	 * @since 4.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _levels: Array<LogLevel>;

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
	 * The limit of pending messages for each stream.
	 *
	 * @type {number}
	 * @protected
	 * @memberof FileLogStreamService
	 * @since 4.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _streamLimit: number;

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
	 * @param {string} abspath
	 * @param {Array<LogLevel>} levels
	 * @param {number} streamLimit
	 * @public
	 * @memberof FileLogStreamService
	 * @since 4.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public constructor(
		abspath: string,
		levels: Array<LogLevel>,
		streamLimit: number = 10000,
		killOnLimit: boolean = false,
	) {
		this._abspath = abspath;
		this._levels = levels;
		this._streamLimit = streamLimit;
		this._killOnLimit = killOnLimit;

		this._streams = new Map();
		this._pending = new Map();

		for (const level of this._levels) {
			this.createStream(abspath, level);
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
		for (const level of this._levels) {
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
		if (!this._levels.includes(level)) {
			return;
		}

		const stream = this._streams.get(level);

		if (stream && stream.write(message) !== false) {
			return;
		}

		if (this._pending.has(level)) {
			if (this._pending.get(level)!.length >= this._streamLimit) {
				/* eslint-disable no-console */
				console.warn(
					`[FileLogStreamService] Stream limit reached for level ${level}, message discarded`,
				);

				if (this._killOnLimit) {
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
