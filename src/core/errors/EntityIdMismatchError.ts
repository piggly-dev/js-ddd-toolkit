import { BusinessRuleViolationError } from './BusinessRuleViolationError';

/**
 * @file Entity ID mismatch error class.
 * @copyright Piggly Lab 2025
 */
export class EntityIdMismatchError extends BusinessRuleViolationError {
	constructor() {
		super(
			'EntityIdMismatchError',
			'Entity ID mismatch.',
			'Entity ID does not match.',
			422,
		);
	}
}
