import { BusinessRuleViolationError } from '@/core/errors/BusinessRuleViolationError.js';

/**
 * @file Entity ID mismatch error class.
 * @copyright Piggly Lab 2025
 */
export class EntityIdMismatchError extends BusinessRuleViolationError {
	/**
	 * Create a new instance of the error.
	 * Code: 3612039619
	 *
	 * @since 4.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public constructor() {
		super(
			'EntityIdMismatchError',
			'Entity ID mismatch.',
			'Entity ID does not match.',
			422,
		);
	}
}
