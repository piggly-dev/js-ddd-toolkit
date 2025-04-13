import { BusinessRuleViolationError } from '@/core/errors/BusinessRuleViolationError';

/**
 * @file Invalid schema error class.
 * @copyright Piggly Lab 2024
 */
export class InvalidSchemaError extends BusinessRuleViolationError {
	/**
	 * Create a new instance of the error.
	 * Code: 3612039619
	 *
	 * @param {string[]} errors The errors.
	 * @param {string} message The message.
	 * @param {string} hint The hint.
	 * @since 4.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public constructor(errors: string[], message?: string, hint?: string) {
		super(
			'InvalidSchemaError',
			message ?? 'One or more values are invalid in current schema.',
			hint,
			422,
			{ errors },
		);
	}
}
