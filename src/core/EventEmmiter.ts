import { EventListener } from './types';

export class EventEmmiter {
	protected events: Map<string, Array<EventListener>> = new Map();

	constructor() {
		this.events = new Map();
	}

	on(event: string, listener: EventListener): void {
		if (!this.events.has(event)) {
			this.events.set(event, []);
		}

		this.events.get(event)?.push(listener);
	}

	off(event: string, listener?: EventListener): void {
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

	emit(event: string, ...args: any[]): void {
		if (!this.events.has(event)) {
			return;
		}

		this.events.get(event)?.forEach(listener => listener(...args));
	}
}
