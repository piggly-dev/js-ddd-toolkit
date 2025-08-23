import z from 'zod';

import { InvalidNormalizationError } from '@/core/errors/InvalidNormalizationError.js';
import { zodIssuesToDataIssues } from '@/utils/index.js';

/**
 * @file The error to be thrown when the payload cannot be validated.
 * @since 5.0.0
 * @copyright Piggly Lab 2025
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class InvalidSchemaNormalizationError extends InvalidNormalizationError {
	/**
	 * Create a new instance of the error.
	 *
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 * @param {string} subject The subject of the error.
	 * @param {DataIssues} issues The issues found.
	 */
	constructor(subject: string, issues: Array<z.ZodError['issues'][number]>) {
		super(subject, zodIssuesToDataIssues(issues));
	}
}
