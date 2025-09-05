import type z from 'zod';

import dotenv from 'dotenv';

import type { EnvironmentType } from '@/index.js';

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

/**
 * Parse the current process environment variables.
 *
 * @param schema
 * @returns Output schema type.
 * @since 5.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const parseEnv = <Schema extends z.ZodType>(
	schema: Schema,
): z.output<Schema> => {
	const parsed = schema.safeParse(process.env);

	if (parsed.error) {
		throw new Error(parsed.error.message);
	}

	return parsed.data;
};
