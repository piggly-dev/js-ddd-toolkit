import DomainError from '../DomainError';

export default class InvalidSchemaError extends DomainError {
	constructor(errors: string[], message?: string, hint?: string) {
		super(
			'InvalidSchemaError',
			10,
			message ?? 'One or more values are invalid in current schema.',
			422,
			hint,
			{ errors }
		);
	}
}
