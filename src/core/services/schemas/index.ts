import { z } from 'zod';

import { evaluateAbspath, parseAbspath } from '@/utils';

export const LogLevelSchema = z.enum(['debug', 'info', 'warn', 'error', 'fatal']);

/**
 * Log level.
 *
 * @since 4.1.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export type LogLevel = z.infer<typeof LogLevelSchema>;

export const LoggerFnSchema = z.custom<(...args: any[]) => Promise<void>>(
	v => typeof v === 'function',
);

/**
 * Logger function.
 *
 * @since 4.1.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export type LoggerFn = z.infer<typeof LoggerFnSchema>;

export const FileLogStreamServiceSettingsSchema = z.object({
	// required
	abspath: z
		.string()
		.refine(v => evaluateAbspath(v), {
			message: 'Invalid abspath',
		})
		.transform(v => parseAbspath(v)),
	levels: z.array(LogLevelSchema).default(['error', 'fatal']),
	// optional
	errorThreshold: z.number().optional().default(10),
	killOnLimit: z.boolean().optional().default(false),
	streamLimit: z.number().optional().default(10000),
});

/**
 * File log stream service settings.
 *
 * - abspath: The path to the file to log to.
 * - killOnLimit: If true, will kill the process if the limit is reached.
 * - levels: The levels to log to.
 * - streamLimit: The limit of pending messages for each stream.
 * - errorThreshold: The threshold of stream errors to kill the process.
 *
 * @since 4.1.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export type FileLogStreamServiceSettings = z.infer<
	typeof FileLogStreamServiceSettingsSchema
>;

// entry
export type FileLogStreamServiceEntry = Omit<
	FileLogStreamServiceSettings,
	'errorThreshold' | 'killOnLimit' | 'streamLimit' | 'levels'
> &
	Partial<
		Pick<
			FileLogStreamServiceSettings,
			'errorThreshold' | 'killOnLimit' | 'streamLimit' | 'levels'
		>
	>;

export const OnGoingPromisesServiceSettingsSchema = z.object({
	// optional
	killOnLimit: z.boolean().optional().default(false),
	limit: z.number().optional().default(10000),
});

/**
 * On going promises service settings.
 *
 * - killOnLimit: If true, will kill the process if the limit is reached.
 * - limit: The limit of ongoing promises.
 *
 * @since 4.1.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export type OnGoingPromisesServiceSettings = z.infer<
	typeof OnGoingPromisesServiceSettingsSchema
>;

// entry
export type OnGoingPromisesServiceEntry = Partial<OnGoingPromisesServiceSettings>;

export const LoggerServiceSettingsSchema = z.object({
	alwaysOnConsole: z.boolean().optional().default(false),
	callbacks: z
		.object({
			onDebug: LoggerFnSchema.optional(),
			onError: LoggerFnSchema.optional(),
			onFatal: LoggerFnSchema.optional(),
			onInfo: LoggerFnSchema.optional(),
			onWarn: LoggerFnSchema.optional(),
		})
		.strict()
		.optional()
		.default({
			onDebug: undefined,
			onError: undefined,
			onFatal: undefined,
			onInfo: undefined,
			onWarn: undefined,
		}),
	ignoreLevels: z.array(LogLevelSchema).optional().default([]),
	ignoreUnset: z.boolean().optional().default(true),
	onError: z
		.custom<(error: unknown) => void>(v => typeof v === 'function')
		.optional(),
	onFlush: z.custom<() => Promise<void>>(v => typeof v === 'function').optional(),
	promises: z
		.object({
			track: z
				.array(
					z.enum([
						'onDebug',
						'onError',
						'onFatal',
						'onFlush',
						'onInfo',
						'onWarn',
					]),
				)
				.optional()
				.default(['onError', 'onFatal']),
		})
		.extend(OnGoingPromisesServiceSettingsSchema.shape)
		.optional()
		.default({
			killOnLimit: false,
			limit: 10000,
			track: ['onError', 'onFatal'],
		}),
});

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
export type LoggerServiceSettings = z.infer<typeof LoggerServiceSettingsSchema>;

// entry
export type LoggerServiceEntry = Omit<
	LoggerServiceSettings,
	'alwaysOnConsole' | 'ignoreLevels' | 'ignoreUnset' | 'callbacks' | 'promises'
> &
	Partial<
		Pick<
			LoggerServiceSettings,
			| 'alwaysOnConsole'
			| 'ignoreLevels'
			| 'ignoreUnset'
			| 'callbacks'
			| 'promises'
		>
	>;
