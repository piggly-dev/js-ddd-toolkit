import type { z } from 'zod';

import { BusinessRuleViolationError } from '@/core/errors/BusinessRuleViolationError';

/**
 * @file The error to be thrown when the payload cannot be validated.
 * @since 4.0.0
 * @copyright Piggly Lab 2025
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class InvalidPayloadSchemaError extends BusinessRuleViolationError {
	/**
	 * Create a new instance of the error.
	 *
	 * @since 4.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 * @param {string} name The name of the error.
	 * @param {string} hint A hint to solve the problem.
	 * @param {Array<ZodIssue>} issues The issues found.
	 * @param {Record<string, string>} map The map of fields.
	 */
	constructor(
		name: string,
		hint: string,
		issues: Array<z.ZodError['issues'][number]>,
		map?: Record<string, string>,
	) {
		const errors = InvalidPayloadSchemaError.prepareIssues(issues, map);

		super(
			name,
			'Payload cannot be validated. See context for more information.',
			hint,
			422,
			errors,
		);
	}

	/**
	 * Prepare the issues.
	 *
	 * @param {Array<ZodIssue>} issues The issues found.
	 * @param {Record<string, string>} mapTo The map of fields.
	 * @returns {Array<{ field: string; message: string }>} The prepared issues.
	 * @since 4.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected static prepareIssues(
		issues: Array<z.ZodError['issues'][number]>,
		mapTo?: Record<string, string>,
	): Array<{ field: string; message: string }> {
		const errors: Array<{ field: string; message: string }> = [];

		issues.forEach(issue => {
			const field = issue.path.map(i => i.toString()).join('.');

			if (!mapTo) {
				errors.push({ field, message: issue.message });
				return;
			}

			const mapped = mapTo[field];

			if (!mapped) {
				return;
			}

			errors.push({ field: mapped, message: issue.message });
		});

		return errors;
	}
}
