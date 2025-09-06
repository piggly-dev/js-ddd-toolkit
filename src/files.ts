import type z from 'zod';

import fs from 'node:fs';

import dotenv from 'dotenv';
import yaml from 'js-yaml';
import ini from 'ini';

import type { EnvironmentType } from '@/index.js';

/**
 * Load configuration from a yaml file.
 *
 * @param absolute_path
 * @param file_name Without the yml extension.
 * @param schema
 * @param extension The extension of the file.
 * @returns Output schema type.
 * @since 5.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const loadYaml = async <Schema extends z.ZodType>(
	absolute_path: string,
	file_name: string,
	schema: Schema,
	extension = 'yml',
): Promise<z.output<Schema>> => {
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
 * Load configuration from a ini file.
 *
 * @param absolute_path
 * @param file_name Without the ini extension.
 * @param schema
 * @returns Output schema type.
 * @since 5.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const loadConfigIni = async <Schema extends z.ZodType>(
	absolute_path: string,
	file_name: string,
	schema: Schema,
): Promise<z.output<Schema>> => {
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
 * @param type Will be used to load the correct file: .env.develoment, .env.test, etc.
 * @param absolute_path
 * @param schema
 * @returns Output schema type.
 * @since 4.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const loadDotEnv = async <Schema extends z.ZodType>(
	type: EnvironmentType,
	absolute_path: string,
	schema: Schema,
): Promise<z.output<Schema>> => {
	dotenv.config({
		path: `${absolute_path}/.env.${type}`,
	});

	const parsed = schema.safeParse(process.env);

	if (parsed.error) {
		throw new Error(parsed.error.message);
	}

	return parsed.data;
};
