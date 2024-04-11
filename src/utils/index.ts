import Joi from 'joi';
import { InvalidSchemaError, Result } from '@/core';

/**
 * Validate an entry against the schema.
 *
 * @param {Joi.Schema} schema
 * @param {any} entry
 * @param {Joi.LanguageMessages} [messages]
 * @since 2.0.2
 * @returns {Result<Payload, InvalidSchemaError>}
 * @author Caique Araujo <caique@piggly.com.br>
 */
export const schemaValidator = <Payload>(
	schema: Joi.Schema,
	entry: any,
	messages?: Joi.LanguageMessages
): Result<Payload, InvalidSchemaError> => {
	const { error, value } = schema.validate(entry ?? {}, {
		messages,
	});

	if (error) {
		return Result.fail<InvalidSchemaError>(
			new InvalidSchemaError(error.details.map(val => val.message))
		);
	}

	return Result.ok<Payload>(value);
};
