import type { DataIssues, DataIssue } from '@/core/errors/types/index.js';

import { BusinessRuleViolationError } from '@/core/errors/BusinessRuleViolationError';

/**
 * @file The error to be thrown when the payload cannot be validated.
 * @since 5.0.0
 * @copyright Piggly Lab 2025
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class InvalidNormalizationError extends BusinessRuleViolationError {
	/**
	 * Create a new instance of the error.
	 *
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 * @param {string} subject The subject of the error.
	 * @param {DataIssues | DataIssue} issues The issues found.
	 */
	constructor(subject: string, issues: DataIssues | DataIssue) {
		super(
			`Invalid${subject}NormalizationError`,
			'Data cannot be normalized. See context for more information.',
			undefined,
			422,
			Array.isArray(issues) ? issues : [issues],
		);
	}
}
