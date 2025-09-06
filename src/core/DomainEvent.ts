import { v7 as uuidv7 } from 'uuid';

import type { IDomainEvent } from '@/core/types/index.js';

/**
 * @file Base domain event class to be used/extended by all domain events.
 * @copyright Piggly Lab 2023
 */
export class DomainEvent<Payload extends Record<string, any>>
	implements IDomainEvent<Payload>
{
	/**
	 * Event data, where EventData may be an object.
	 *
	 * @type {EventData}
	 * @public
	 * @readonly
	 * @since 1.0.0
	 * @memberof EventPayload
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	readonly data: Readonly<Payload>;

	/**
	 * Event id.
	 *
	 * @type {string}
	 * @public
	 * @readonly
	 * @since 1.0.0
	 * @memberof EventPayload
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	readonly id: string;

	/**
	 * Event occurred at timestamp.
	 *
	 * @type {number}
	 * @public
	 * @readonly
	 * @since 1.0.0
	 * @memberof EventPayload
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	readonly issued_at: number;

	/**
	 * Event name.
	 *
	 * @type {string}
	 * @public
	 * @readonly
	 * @since 1.0.0
	 * @memberof EventPayload
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	readonly name: string;

	/**
	 * Constructor with event name and data.
	 *
	 * @param {string} name
	 * @param {Payload} data
	 * @constructor
	 * @public
	 * @since 1.0.0
	 * @memberof EventPayload
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(name: string, data: Payload) {
		this.id = this.generateId();
		this.name = name;
		this.data = Object.freeze(data);
		this.issued_at = Date.now();
	}

	/**
	 * Event occurred at timestamp.
	 *
	 * @type {number}
	 * @public
	 * @readonly
	 * @since 1.0.0
	 * @memberof EventPayload
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get occurred_at(): number {
		return this.issued_at;
	}

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
		return uuidv7();
	}
}
