import { EventListener } from './types';

/**
 * @file Base event emmiter class, simple and smart.
 * @copyright Piggly Lab 2024
 */
export class EventEmitter {
	/**
	 * Event listeners.
	 *
	 * @type {Map<string, Array<EventListener>>}
	 * @public
	 * @readonly
	 * @since 3.0.5
	 * @memberof EventEmitter
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected events: Map<string, Array<EventListener>> = new Map();

	/**
	 * Startup a new event emmiter.
	 *
	 * @public
	 * @constructor
	 * @memberof EventEmitter
	 * @since 3.0.5
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor() {
		this.events = new Map();
	}

	/**
	 * Emit a event.
	 *
	 * @param {string} event
	 * @param {...any} args
	 * @returns {void}
	 * @public
	 * @memberof EventEmitter
	 * @since 3.0.5
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public emit(event: string, ...args: any[]): void {
		if (!this.events.has(event)) {
			return;
		}

		const listeners = this.events.get(event)?.slice() ?? [];
		listeners.forEach(listener => listener(...args));
	}

	/**
	 * Remove a event listener.
	 *
	 * @param {string} event
	 * @param {EventListener} listener
	 * @returns {void}
	 * @public
	 * @memberof EventEmitter
	 * @since 3.0.5
	 * @author Caique Araujo <caique@piggly.com.br>
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
			this.events.get(event)?.filter(l => l !== listener) ?? [],
		);
	}

	/**
	 * Register a new event listener.
	 * Returns a function to unsubscribe the listener.
	 *
	 * @param {string} event
	 * @param {EventListener} listener
	 * @returns {void}
	 * @public
	 * @memberof EventEmitter
	 * @since 3.0.5
	 * @since 5.0.0 Added return function to unsubscribe the listener.
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public on(
		event: string,
		listener: EventListener,
		opts?: { signal?: AbortSignal },
	): () => void {
		if (!this.events.has(event)) {
			this.events.set(event, []);
		}

		this.events.get(event)?.push(listener);

		if (opts?.signal) {
			if (opts.signal.aborted) {
				this.off(event, listener);
			} else {
				opts.signal.addEventListener('abort', () => this.off(event, listener), {
					once: true,
				});
			}
		}

		return () => this.off(event, listener);
	}

	/**
	 * Register a new event listener that will be removed after the first event is emitted.
	 * Returns a function to unsubscribe the listener.
	 *
	 * @param {string} event
	 * @param {EventListener} listener
	 * @returns {void}
	 * @public
	 * @memberof EventEmitter
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public once(event: string, listener: EventListener): () => void {
		const wrap: EventListener = (...args) => {
			this.off(event, wrap);
			listener(...args);
		};

		return this.on(event, wrap);
	}

	/**
	 * Unsubscribe all event listeners.
	 *
	 * @returns {void}
	 * @public
	 * @memberof EventEmitter
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public unsubscribeAll(): void {
		this.events.clear();
	}
}
