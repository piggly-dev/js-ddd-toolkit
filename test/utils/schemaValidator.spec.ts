import { InvalidSchemaError } from '@/index';
import { schemaValidator } from '@/utils';
import Joi from 'joi';

describe('SchemaValidator', () => {
	const schema = Joi.object({
		name: Joi.string().required(),
		age: Joi.number().required(),
	});

	const messages = {
		'any.required': 'The field {{#label}} is required.',
		'string.base': 'The field {{#label}} must be a string.',
		'number.base': 'The field {{#label}} must be a number.',
	};

	it('should validate an entry against the schema', () => {
		const result = schemaValidator(
			schema,
			{
				name: 'John Doe',
				age: 30,
			},
			messages
		);

		expect(result.isSuccess).toBe(true);
		expect(result.data).toStrictEqual({
			name: 'John Doe',
			age: 30,
		});
	});

	it('should return an error when the entry is invalid', () => {
		const result = schemaValidator(
			schema,
			{
				name: 'John Doe',
			},
			messages
		);

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
