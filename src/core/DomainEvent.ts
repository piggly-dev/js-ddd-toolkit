import { EventPayload } from '@piggly/event-bus';
import { v4 as uuidv4 } from 'uuid';

/**
 * @file Base domain event class to be used/extended by all domain events.
 * @copyright Piggly Lab 2023
 */
export default class DomainEvent<Payload> extends EventPayload<Payload> {
	/**
	 * Will generate a new uuidv4 for default id.
	 *
	 * @returns {string}
	 * @public
	 * @memberof DomainEvent
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public generateId(): string {
		return uuidv4();
	}
}
