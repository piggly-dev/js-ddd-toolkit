import type { z } from 'zod';

import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

import moment from 'moment-timezone';
import sanitize from 'sanitize-html';

import type { DataIssues } from '@/core/errors/types/index.js';
import type { TDateInput, TOrEmpty } from '@/types';

import { InvalidPayloadSchemaError } from '@/core/errors/InvalidPayloadSchemaError';
import { CryptoService } from '@/core/services/CryptoService';
import { DomainError } from '@/core/errors/DomainError';
import { EnvironmentType } from '@/utils/types';
import { Result } from '@/core/Result';

import { DateParser } from './parsers/DateParser';

export function commaStringAsArray(str?: string): Array<string> {
	if (!str) return [];
	return str.split(',').map(s => s.trim());
}

export const lastAvailableString = (
	entry: string[] | string,
	defaultValue: string,
	separator = ',',
) => {
	if (!entry) {
		return defaultValue;
	}

	if (Array.isArray(entry) === false) {
		if (entry.includes(separator)) {
			return (
				(entry as string)
					.split(separator)
					.map(s => s.trim())
					.pop() ?? defaultValue
			);
		}

		return entry;
	}

	if (entry.length === 0) {
		return defaultValue;
	}

	return (entry as Array<string>).pop() ?? defaultValue;
};

export function deleteKeys<T extends Record<string, any>>(
	obj: T,
	keys: string[],
): Partial<T> {
	// TODO :: internal exclusion with dot
	if (keys.length === 0) return obj;

	const copy = { ...obj };
	Object.keys(copy).forEach(key => keys.includes(key) && delete copy[key]);
	return copy;
}

export function getTimestamp(native = false): number {
	if (!native) {
		return moment().unix();
	}

	return Math.floor(new Date().getTime() / 1000);
}

export function parseEmpty<T>(val: T): TOrEmpty<T> {
	if (val === null) return null;
	if (val === undefined) return undefined;
	return val;
}

/**
 * Preserve value when it is equal to `when`.
 *
 * @param {any} value
 * @param {any} when
 * @param {any} _default
 * @returns {any}
 * @since 3.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export function preserve(value: any, when: any, _default: any): any {
	if (value === when) return when;
	if (value === undefined || value === null) return _default;
	return value;
}

/**
 * Parse to JSON copy of an object.
 *
 * @param {Array<T>} obj
 * @returns {object}
 * @since 3.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export function parseToJson(obj: { [key: string]: any }): object {
	const copy: { [key: string]: any } = {};

	Object.keys(obj).forEach(k => {
		if (Array.isArray(obj[k]) || typeof obj[k] === 'object') {
			copy[k] = JSON.stringify(obj[k]);
			return;
		}

		copy[k] = obj[k];
	});

	return copy;
}

/**
 * Remove item from array.
 *
 * @param {Array<T>} arr
 * @param {T} item
 * @returns {Array<T>}
 * @since 3.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export function removeItem<T>(arr: Array<T>, item: T): Array<T> {
	return arr.filter(el => el !== item);
}

/**
 * Remove index from array.
 *
 * @param {Array} arr
 * @param {number} index
 * @returns {Array}
 * @since 3.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export function removeIndex<T>(arr: Array<T>, index: number): Array<T> {
	return arr.filter((_, idx) => idx !== index);
}

/**
 * Get a random string.
 *
 * @param {number} length
 * @returns {string}
 * @since 3.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export function randomString(length: number): string {
	return crypto
		.randomBytes(length)
		.toString('base64url')
		.replace(/[^A-Za-z0-9]/gi, '')
		.substring(0, length);
}

/**
 * Convert any to an JSON object.
 *
 * @param {(string|object)} obj
 * @returns {object}
 * @since 3.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export function toJSON(obj: string | object): object {
	if (typeof obj === 'string') {
		return JSON.parse(obj);
	}

	return obj;
}

/**
 * Convert any to an array.
 *
 * @param {any} val
 * @returns {Array<T>}
 * @since 3.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export function toArray<T>(val?: Array<T> | T): Array<T> {
	if (!val) return [];
	if (Array.isArray(val)) return val;
	return [val];
}

/**
 * Convert date to moment.
 *
 * @param {TDateInput} val
 * @returns {moment.Moment}
 * @since 3.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export function toMoment(val: TDateInput): moment.Moment {
	return DateParser.toMoment(val);
}

/**
 * Convert date to RFC3339 format.
 *
 * @param {moment.Moment} date
 * @param {string} timezone
 * @returns {string}
 * @since 3.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export function toRFC3339(date: moment.Moment, timezone = 'UTC'): string {
	return date.tz(timezone).format('YYYY-MM-DDTHH:mm:ssZ');
}

/**
 * Mount an URL based on a base and a relative path.
 *
 * @param {string} base
 * @param {string} relative_path
 * @returns {string}
 * @since 3.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export function mountURL(base: string, relative_path: string): string {
	let path = relative_path;

	if (path.startsWith('/')) {
		path = path.substring(1);
	}

	return `${base}/${path}`;
}

/**
 * Split a string and trim each item.
 *
 * @param {string} str
 * @param {string} separator
 * @returns {string[]}
 * @since 3.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export function splitAndTrim(str: string, separator: string): Array<string> {
	return str.split(separator).map(s => s.trim());
}

/**
 * Evaluate a schema.
 *
 * @param {string} type
 * @param {any} input
 * @param {ZodSchema<any>} schema
 * @param {string} hint
 * @param {Record<string, string>} map The map of fields. { field: 'Returning Label' }
 * @returns {Result<any, DomainError>}
 * @since 4.0.0
 * @returns {Result<Payload, InvalidSchemaError>}
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const evaluateSchema = <Schema extends z.ZodType>(
	type: string,
	input: z.input<Schema>,
	schema: Schema,
	hint?: string,
	map?: Record<string, string>,
): Result<z.output<Schema>, DomainError> => {
	const result = schema.safeParse(input);

	if (!result.success) {
		return Result.fail(
			new InvalidPayloadSchemaError(
				'InvalidPayloadSchemaError',
				hint ?? `Invalid ${type} schema. Check the payload before continue.`,
				result.error.issues,
				map,
			),
		);
	}

	return Result.ok(result.data);
};

/**
 * Sanitize a string recursively.
 *
 * @param {any} data
 * @returns {any}
 * @since 4.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const sanitizeRecursively = <T = any>(data: T): T => {
	if (typeof data === 'string') {
		return sanitize(data) as T;
	}

	if (Array.isArray(data)) {
		return data.map(sanitizeRecursively) as T;
	}

	if (data !== null && typeof data === 'object') {
		const sanitizedObj: any = {};

		for (const key in data) {
			sanitizedObj[key] = sanitizeRecursively(data[key]);
		}

		return sanitizedObj as T;
	}

	return data as T;
};

/**
 * Load configuration from a ini file.
 *
 * @param {string} absolute_path
 * @param {string} file_name Without the ini extension.
 * @param {ZodObject<any>} schema
 * @returns {string}
 * @since 4.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const loadConfigIni = async <Schema extends z.ZodType>(
	absolute_path: string,
	file_name: string,
	schema: Schema,
): Promise<z.output<Schema>> => {
	const ini = await import('ini');

	return new Promise<z.output<Schema>>((res, rej) => {
		fs.readFile(`${absolute_path}/${file_name}.ini`, 'utf-8', (err, data) => {
			if (err) {
				return rej(err);
			}

			schema
				.safeParseAsync(ini.parse(data))
				.then(parsed => {
					if (parsed.error) {
						return rej(new Error(parsed.error.message));
					}

					return res(parsed.data);
				})
				.catch(err => rej(err));
		});
	});
};

/**
 * Load configuration from a dotenv file.
 *
 * @param {EnvironmentType} type Will be used to load the correct file: .env.develoment, .env.test, etc.
 * @param {string} absolute_path
 * @param {ZodObject<any>} schema
 * @returns {string}
 * @since 4.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const loadDotEnv = async <Schema extends z.ZodType>(
	type: EnvironmentType,
	absolute_path: string,
	schema: Schema,
): Promise<z.output<Schema>> => {
	const dotenv = await import('dotenv');

	dotenv.config({
		path: `${absolute_path}/.env.${type}`,
	});

	const parsed = schema.safeParse(process.env);

	if (parsed.error) {
		throw new Error(parsed.error.message);
	}

	return parsed.data;
};

/**
 * Load configuration from a yaml file.
 *
 * @param {string} absolute_path
 * @param {string} file_name Without the yml extension.
 * @param {ZodObject<any>} schema
 * @param {string} extension The extension of the file.
 * @returns {string}
 * @since 4.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const loadYaml = async <Schema extends z.ZodType>(
	absolute_path: string,
	file_name: string,
	schema: Schema,
	extension = 'yml',
): Promise<z.output<Schema>> => {
	const yaml = await import('js-yaml');

	return new Promise<z.output<Schema>>((res, rej) => {
		fs.readFile(
			`${absolute_path}/${file_name}.${extension}`,
			'utf-8',
			(err, data) => {
				if (err) {
					return rej(err);
				}

				schema
					.safeParseAsync(yaml.load(data))
					.then(parsed => {
						if (parsed.error) {
							return rej(new Error(parsed.error.message));
						}

						return res(parsed.data);
					})
					.catch(err => rej(err));
			},
		);
	});
};

/**
 * Parse a log message. It will return an object with:
 *
 * - uuid: The UUID of the log.
 * - date: The date of the log in format: `YYYY-MM-DD HH:mm:ss`.
 * - display: The display of the log in format: `(level) "message" - arg1 - arg2 - arg3 - ...`.
 * - message: The message of the log in format: `[date] [uuid] display\n`.
 *
 * @param {string} level
 * @param {string} message
 * @param {...any[]} args
 * @returns {{ uuid: string; date: string; display: string; message: string }}
 * @since 4.1.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const displayLog = (
	level: 'debug' | 'error' | 'fatal' | 'info' | 'warn',
	message: string,
	...args: any[]
): { uuid: string; date: string; display: string; message: string } => {
	const uuid = CryptoService.generateUUID();
	const date = moment().utc().format();

	let display = `(${level}) "${message}"`;

	if (args.length > 0) {
		display += ` - ${args
			.map(arg => {
				if (arg instanceof DomainError) {
					return JSON.stringify(arg.toJSON());
				}

				if (arg instanceof Error) {
					return arg.stack ?? arg.message;
				}

				switch (typeof arg) {
					case 'object':
						return `'${JSON.stringify(arg)}'`;
					case 'string':
						return `"${arg}"`;
					default:
						return String(arg);
				}
			})
			.join(' - ')}`;
	}

	return {
		uuid,
		date,
		display,
		message: `[${moment().utc().format()}] [${uuid}] ${display}\n`,
	};
};

/**
 * Parse the absolute path.
 *
 * @param abspath - The absolute path to parse.
 * @returns The absolute path.
 * @since 4.1.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const parseAbspath = (abspath?: string): string => {
	if (!abspath) {
		abspath = './';
	}

	if (abspath.startsWith('./') === true) {
		abspath = path.resolve(process.cwd(), abspath);
	}

	if (abspath.startsWith('/') === false) {
		throw new Error('Absolute path is required and must be absolute.');
	}

	if (fs.existsSync(abspath) === false) {
		throw new Error('The absolute path does not exist.');
	}

	return abspath;
};

/**
 * Evaluate the absolute path.
 *
 * @param abspath - The absolute path to evaluate.
 * @returns True if the absolute path is valid, false otherwise.
 * @since 4.1.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const evaluateAbspath = (abspath?: string): boolean => {
	if (!abspath) {
		return false;
	}

	if (abspath.startsWith('./') === true) {
		return true;
	}

	if (abspath.startsWith('/') === false) {
		return false;
	}

	if (fs.existsSync(abspath) === false) {
		return false;
	}

	return true;
};

/**
 * Generate a random string.
 * Unsafe, use only for non-critical purposes.
 *
 * @param size - The size of the string
 * @returns The string
 * @since 4.1.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const generateString = (
	size: number = 6,
	characters: string = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789',
) => {
	let result = '';

	for (let i = 0; i < size; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}

	return result;
};

/**
 * Slugify a string.
 *
 * @note It may produce an empty string as it not expected as an error.
 * @param v - The string to slugify.
 * @returns The slugified string.
 * @since 4.2.2
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const slugifyAsDash = (v: string) => {
	return v
		.trim()
		.toLowerCase()
		.replace(/[\W\s]/gi, '-')
		.replace(/-+/g, '-')
		.replace(/^-+/, '')
		.replace(/-+$/, '');
};

/**
 * Slugify a string.
 *
 * @note It may produce an empty string as it not expected as an error.
 * @param v - The string to slugify.
 * @returns The slugified string.
 * @since 4.2.2
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const slugifyAsUnderscore = (v: string) => {
	return v
		.trim()
		.toLowerCase()
		.replace(/[\W\s]/gi, '_')
		.replace(/_{2,}/g, '_')
		.replace(/^_+/, '')
		.replace(/_+$/, '');
};

/**
 * Convert zod issues to data issues.
 *
 * @param issues - The zod issues.
 * @returns The data issues.
 * @since 5.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const zodIssuesToDataIssues = (
	issues: Array<z.ZodError['issues'][number]>,
): DataIssues => {
	return issues.map(issue => ({
		field: issue.path.join('.'),
		message: issue.message,
	}));
};
