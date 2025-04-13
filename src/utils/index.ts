import type { ZodObject, ZodSchema } from 'zod';

import crypto from 'crypto';
import fs from 'fs';

import moment from 'moment-timezone';
import sanitize from 'sanitize-html';

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
export const evaluateSchema = <Schema = any>(
	type: string,
	input: any,
	schema: ZodSchema<Schema>,
	hint?: string,
	map?: Record<string, string>,
): Result<Schema, DomainError> => {
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

	return Result.ok(result.data as Schema);
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
export const loadConfigIni = async <
	Schema extends Record<string, any> = Record<string, any>,
>(
	absolute_path: string,
	file_name: string,
	schema: ZodObject<any>,
): Promise<Schema> => {
	const ini = await import('ini');

	return new Promise<Schema>((res, rej) => {
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

					return res(parsed.data as Schema);
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
export const loadDotEnv = async <
	Schema extends Record<string, any> = Record<string, any>,
>(
	type: EnvironmentType,
	absolute_path: string,
	schema: ZodObject<any>,
): Promise<Schema> => {
	const dotenv = await import('dotenv');

	dotenv.config({
		path: `${absolute_path}/.env.${type}`,
	});

	const parsed = schema.safeParse(process.env);

	if (parsed.error) {
		throw new Error(parsed.error.message);
	}

	return parsed.data as Schema;
};

/**
 * Load configuration from a yaml file.
 *
 * @param {string} absolute_path
 * @param {string} file_name Without the yml extension.
 * @param {ZodObject<any>} schema
 * @returns {string}
 * @since 4.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const loadYaml = async <
	Schema extends Record<string, any> = Record<string, any>,
>(
	absolute_path: string,
	file_name: string,
	schema: ZodObject<any>,
): Promise<Schema> => {
	const yaml = await import('js-yaml');

	return new Promise<Schema>((res, rej) => {
		fs.readFile(`${absolute_path}/${file_name}.yml`, 'utf-8', (err, data) => {
			if (err) {
				return rej(err);
			}

			schema
				.safeParseAsync(yaml.load(data))
				.then(parsed => {
					if (parsed.error) {
						return rej(new Error(parsed.error.message));
					}

					return res(parsed.data as Schema);
				})
				.catch(err => rej(err));
		});
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
