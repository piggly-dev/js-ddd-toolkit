import crc from 'crc';

import { DomainError } from './DomainError';

/**
 * @file Business rule violation error class.
 * @copyright Piggly Lab 2024
 */
export class BusinessRuleViolationError extends DomainError {
	/**
	 * Create a new error.
	 *
	 * @param {string} name The name of the error.
	 * @param {string} message The message of the error.
	 * @param {PreviousError | undefined} previous The previous error.
	 * @public
	 * @constructor
	 * @memberof BusinessRuleViolationError
	 * @since 4.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public constructor(
		name: string,
		message: string[] | string,
		hint: string[] | string = 'Try again later.',
		code = 422,
		extra?: Record<string, any>,
	) {
		super(
			name,
			crc.crc32(name),
			typeof message === 'string' ? message : message.join(', '),
			code,
			typeof hint === 'string' ? hint : hint.join(', '),
			extra,
		);
	}
}
