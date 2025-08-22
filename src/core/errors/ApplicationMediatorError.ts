import { crc32 } from 'zlib';

import { ApplicationError } from '@/core/errors/ApplicationError.js';
import { PreviousError } from '@/core/errors/types/index.js';

/**
 * @file Application mediator error class.
 * @copyright Piggly Lab 2025
 */
export class ApplicationMediatorError extends ApplicationError {
	/**
	 * Create a new instance of the error.
	 *
	 * @param {string} message The message of the error.
	 * @param {string} hint The hint of the error.
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public constructor(message: string, hint?: string, previous?: PreviousError) {
		super(
			'ApplicationMediatorError',
			crc32('ApplicationMediatorError'),
			message,
			500,
			hint,
			undefined,
			previous,
		);
	}
}
