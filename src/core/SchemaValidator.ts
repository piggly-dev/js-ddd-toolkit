import Joi from 'joi';
import { Result } from './Result';
import { InvalidSchemaError } from './errors/InvalidSchemaError';

/**
 * @file Schema validator class.
 * @copyright Piggly Lab 2023
 */
export abstract class SchemaValidator<Payload> {
	/**
	 * Schema to be used in the validation.
	 *
	 * @type {Joi.Schema}
	 * @protected
	 * @memberof SchemaValidator
	 * @since 2.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected schema: Joi.Schema;

	/**
	 * Messages to be used in the schema validation.
	 *
	 * @type {Joi.LanguageMessages}
	 * @protected
	 * @memberof SchemaValidator
	 * @since 2.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected messages?: Joi.LanguageMessages;

	/**
	 * Creates a new schema validation.
	 *
	 * @param {Joi.Schema} schema
	 * @param {Joi.LanguageMessages} [messages]
	 * @public
	 * @constructor
	 * @memberof SchemaValidator
	 * @since 2.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(schema: Joi.Schema, messages?: Joi.LanguageMessages) {
		this.schema = schema;
		this.messages = messages;
	}

	/**
	 * Validate an entry against the schema.
	 *
	 * @param {any} entry
	 * @public
	 * @memberof SchemaValidator
	 * @since 2.0.0
	 * @returns {Result<Payload, InvalidSchemaError>}
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public validate(entry: any): Result<Payload, InvalidSchemaError> {
		const { error, value } = this.schema.validate(entry ?? {}, {
			messages: this.messages,
		});

		if (error) {
			return Result.fail<InvalidSchemaError>(
				new InvalidSchemaError(error.details.map(val => val.message))
			);
		}

		return Result.ok<Payload>(value);
	}
}
