export type JWTBuilderServiceSettings = {
	audience?: string;
	issuer: string;
	private_key: string;
	public_key: string;
};

export type LoggerFn = (message?: any, ...optionalParams: any[]) => Promise<void>;

/**
 * Logger service settings.
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
 * @since 4.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export type LoggerServiceSettings = {
	// Custom logger functions:
	callbacks: Partial<{
		onDebug: LoggerFn;
		onError: LoggerFn;
		onFatal: LoggerFn;
		onInfo: LoggerFn;
		onWarn: LoggerFn;
	}>;
	// Uncatched errors
	onError?: (error: Error) => void;
	// Publish/flushes logs
	onFlush?: () => Promise<void>;
	// If true, the logger will always log to the console
	alwaysOnConsole: boolean;
	// The logger service will ignore any unset logger functions
	ignoreUnset: boolean;
	// The logger service will ignore any log level set here
	ignoreLevels: Array<LogLevel>;
	// The logger service will log to a file for each level set here
	file?: {
		abspath: string;
		killOnLimit?: boolean;
		levels: Array<LogLevel>;
		streamLimit?: number;
	};
	// How to handle promises
	promises: {
		killOnLimit?: boolean;
		limit?: number;
		track: Array<
			'onDebug' | 'onError' | 'onFatal' | 'onFlush' | 'onInfo' | 'onWarn'
		>;
	};
};

export type LogLevel = 'debug' | 'error' | 'fatal' | 'info' | 'warn';
