import type z from 'zod';

import fs from 'node:fs';

import { InfisicalSDK } from '@infisical/sdk';
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
 * @throws {ZodError} If the schema is invalid.
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
			`${absolute_path}/${file_name.replace(`.${extension}`, '')}.${extension}`,
			'utf-8',
			(err, data) => {
				if (err) {
					return rej(err);
				}

				schema
					.safeParseAsync(yaml.load(data))
					.then(parsed => {
						if (parsed.error) {
							return rej(parsed.error);
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
 * It will remove the extension from the file name.
 *
 * @param absolute_path
 * @param file_name Without the ini extension.
 * @param schema
 * @throws {ZodError} If the schema is invalid.
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
		fs.readFile(
			`${absolute_path}/${file_name.replace('.ini', '')}.ini`,
			'utf-8',
			(err, data) => {
				if (err) {
					return rej(err);
				}

				schema
					.safeParseAsync(ini.parse(data))
					.then(parsed => {
						if (parsed.error) {
							return rej(parsed.error);
						}

						return res(parsed.data);
					})
					.catch(err => rej(err));
			},
		);
	});
};

/**
 * Load configuration from a dotenv file.
 *
 * @param type Will be used to load the correct file: .env.develoment, .env.test, etc.
 * @param absolute_path
 * @param schema
 * @throws {ZodError} If the schema is invalid.
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

	return schema.parse(process.env);
};

/**
 * Load configuration from Infisical.
 * This function will not modify process.env.
 *
 * This is a simple wrapper. It loads all the secrets of a project
 * and returns them in an object ("key" => "value").
 *
 * If you need granular control over the SDK, don't use this function.
 *
 * It is recommended to use loadDotEnv to load the environment variables with
 * required options about Infisical before using this function.
 *
 * @param options
 * @throws {ZodError} If the schema is invalid.
 * @returns Output schema type.
 * @since 5.2.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const loadInfisicalSecrets = async <Schema extends z.ZodType>(
	options: {
		client_id: string;
		project_id: string;
		client_secret: string;
		environment: string;
		site_url: string;
	},
	schema: Schema,
): Promise<z.output<Schema>> => {
	const infisical = new InfisicalSDK({
		siteUrl: options.site_url,
	});

	await infisical.auth().universalAuth.login({
		clientId: options.client_id,
		clientSecret: options.client_secret,
	});

	const secrets = await infisical.secrets().listSecrets({
		environment: options.environment,
		projectId: options.project_id,
	});

	const ENV: Record<string, string> = {};

	for (const secret of secrets.secrets) {
		ENV[secret.secretKey] = secret.secretValue;
	}

	return schema.parse(ENV);
};
