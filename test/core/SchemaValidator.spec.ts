import { InvalidSchemaError, SchemaValidator } from '@/index';
import Joi from 'joi';

class PersonSchemaValidator extends SchemaValidator<{ name: string; age: number }> {
	constructor(messages?: Joi.LanguageMessages) {
		super(
			Joi.object({
				name: Joi.string().required(),
				age: Joi.number().required(),
			}),
			messages
		);
	}
}

describe('SchemaValidator', () => {
	const messages = {
		'any.required': 'The field {{#label}} is required.',
		'string.base': 'The field {{#label}} must be a string.',
		'number.base': 'The field {{#label}} must be a number.',
	};

	it('should create a new instance of validator', () => {
		const validator = new PersonSchemaValidator(messages);
		expect(validator).toBeInstanceOf(PersonSchemaValidator);
	});

	it('should validate an entry against the schema', () => {
		const validator = new PersonSchemaValidator(messages);

		const result = validator.validate({
			name: 'John Doe',
			age: 30,
		});

		expect(result.isSuccess).toBe(true);
		expect(result.data).toStrictEqual({
			name: 'John Doe',
			age: 30,
		});
	});

	it('should return an error when the entry is invalid', () => {
		const validator = new PersonSchemaValidator(messages);

		const result = validator.validate({
			name: 'John Doe',
		});

		expect(result.isFailure).toBe(true);
		expect(result.error).toBeInstanceOf(InvalidSchemaError);
		expect(result.error.code).toBe(10);
		expect(result.error.message).toBe(
			'One or more values are invalid in current schema.'
		);
		expect(result.error.status).toBe(422);
		expect(result.error.hint).toBe(undefined);
		expect(result.error.extra).toStrictEqual({
			errors: ['The field "age" is required.'],
		});
	});
});
