import type z from 'zod';

import fs from 'fs';

import ini from 'ini';

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
