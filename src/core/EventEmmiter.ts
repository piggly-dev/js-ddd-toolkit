import { EventListener } from './types';

/**
 * @file Base event emmiter class, simple and smart.
 * @copyright Piggly Lab 2024
 */
export class EventEmmiter {
	/**
	 * Event listeners.
	 *
	 * @type {Map<string, Array<EventListener>>}
	 * @public
	 * @readonly
	 * @since 3.0.5
	 * @memberof EventEmmiter
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected events: Map<string, Array<EventListener>> = new Map();

	/**
	 * Startup a new event emmiter.
	 *
	 * @public
	 * @constructor
	 * @memberof EventEmmiter
	 * @since 3.0.5
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor() {
		this.events = new Map();
	}

	/**
	 * Register a new event listener.
	 *
	 * @param {string} event
	 * @param {EventListener} listener
	 * @returns {void}
	 * @public
	 * @memberof EventEmmiter
	 * @since 3.0.5
	 */
	public on(event: string, listener: EventListener): void {
		if (!this.events.has(event)) {
			this.events.set(event, []);
		}

		this.events.get(event)?.push(listener);
	}

	/**
	 * Remove a event listener.
	 *
	 * @param {string} event
	 * @param {EventListener} listener
	 * @returns {void}
	 * @public
	 * @memberof EventEmmiter
	 * @since 3.0.5
	 */
	public off(event: string, listener?: EventListener): void {
		if (!this.events.has(event)) {
			return;
		}

		if (!listener) {
			this.events.delete(event);
			return;
		}

		this.events.set(
			event,
			this.events.get(event)?.filter(l => l !== listener) ?? []
		);
	}

	/**
	 * Emit a event.
	 *
	 * @param {string} event
	 * @param {...any} args
	 * @returns {void}
	 * @public
	 * @memberof EventEmmiter
	 * @since 3.0.5
	 */
	public emit(event: string, ...args: any[]): void {
		if (!this.events.has(event)) {
			return;
		}

		this.events.get(event)?.forEach(listener => listener(...args));
	}
}
