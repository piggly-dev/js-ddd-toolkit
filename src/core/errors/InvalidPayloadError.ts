import { BusinessRuleViolationError } from './BusinessRuleViolationError';

/**
 * @file Invalid payload error class.
 * @copyright Piggly Lab 2024
 */
export class InvalidPayloadError extends BusinessRuleViolationError {
	constructor(
		name: string,
		message: string,
		hint: string,
		extra?: {
			fieldErrors?: Record<string, any>;
			formErrors?: string[];
		},
	) {
		const errors: any = { form: ['Invalid payload.'] };

		if (extra) {
			if (extra.formErrors && extra.formErrors.length > 0) {
				errors.form = extra.formErrors;
			}

			if (extra.fieldErrors && Object.keys(extra.fieldErrors).length > 0) {
				errors.fields = extra.fieldErrors;
			}
		}

		super(name, message, hint, 422, errors);
	}
}
