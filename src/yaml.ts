import type z from 'zod';

import fs from 'fs';

import yaml from 'js-yaml';

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
