import type { EventListener, IEntity } from '@/core/types/index.js';

import { EntityID } from '@/core/entities/EntityID.js';
import { EventEmitter } from '@/core/EventEmitter.js';
import { DomainEvent } from '@/core/DomainEvent.js';

/**
 * @file Base entity class.
 * @copyright Piggly Lab 2023
 */
export abstract class Entity<Props, Id extends EntityID<any>>
	implements IEntity<Id>
{
	/**
	 * The maximum number of events.
	 *
	 * @type {number}
	 * @private
	 * @static
	 * @memberof Entity
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	private static readonly MAX_EVENTS = 64;

	/**
	 * The event emmiter.
	 *
	 * @type {EventEmitter}
	 * @public
	 * @memberof Entity
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _emitter?: EventEmitter;

	/**
	 * The entity events.
	 *
	 * @type {Array<DomainEvent<any>>}
	 * @protected
	 * @memberof Entity
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _events: Array<DomainEvent<any>>;

	/**
	 * The entity identifier.
	 *
	 * @type {Id}
	 * @protected
	 * @readonly
	 * @memberof Entity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected readonly _id: Id;

	/**
	 * Indicates if the entity was modified.
	 *
	 * @type {boolean}
	 * @protected
	 * @memberof Entity
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _modified: boolean;

	/**
	 * The entity props.
	 *
	 * @type {Props}
	 * @protected
	 * @readonly
	 * @memberof Entity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _props: Props;

	/**
	 * Creates an instance of Entity.
	 *
	 * @param {props} props
	 * @param {Id | undefined} id
	 * @param {EventEmitter | undefined} emitter
	 * @param {Array<DomainEvent<any>> | undefined} events
	 * @public
	 * @constructor
	 * @memberof Entity
	 * @since 1.0.0
	 * @since 5.0.0 Added modified flag.
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(
		props: Props,
		id?: Id,
		emitter?: EventEmitter,
		events?: Array<DomainEvent<any>>,
	) {
		this._id = id ?? this.generateId();
		this._props = props;
		this._modified = false;

		this._emitter = emitter ?? undefined;
		this._events = events ?? [];
	}

	/**
	 * Get the event emitter.
	 *
	 * @returns {EventEmitter}
	 * @private
	 * @memberof Entity
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	private get emitter(): EventEmitter {
		return (this._emitter ??= new EventEmitter());
	}

	/**
	 * Gets the entity identifier.
	 *
	 * @returns {Id}
	 * @public
	 * @memberof Entity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get id(): Id {
		return this._id;
	}

	/**
	 * Clone the entity.
	 * This method must be implemented by the entity.
	 *
	 * @param {Id | undefined} _
	 * @returns {this}
	 * @throws {Error} If the method is not implemented.
	 * @public
	 * @memberof Entity
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public clone(_?: Id): this {
		throw new Error('Not implemented');
	}

	/**
	 * Dispose the entity.
	 *
	 * @returns {void}
	 * @public
	 * @memberof Entity
	 * @since 5.0.0
	 */
	public dispose(): void {
		if (this._emitter) {
			this._emitter.unsubscribeAll();
			this._emitter = undefined;
		}

		this._events.length = 0;
	}

	/**
	 * Emit an event.
	 *
	 * @param {string} event
	 * @param {...any[]} args
	 * @returns {void}
	 * @public
	 * @memberof Entity
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public emit(event: string, ...args: any[]): void {
		this._emitter?.emit(event, ...args);
	}

	/**
	 * Checks if two entities are equal.
	 *
	 * @param {Entity<Props, any> | undefined | null} e
	 * @returns {boolean}
	 * @public
	 * @memberof Entity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public equals(e: IEntity<any> | undefined | null): boolean {
		if (e === null || e === undefined || e.is('entity') === false) {
			return false;
		}

		if (this === e) {
			return true;
		}

		return e.id.equals(this.id);
	}

	/**
	 * Checks if the entity has events.
	 *
	 * @returns {boolean}
	 * @public
	 * @memberof Entity
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public hasEvents(): boolean {
		return this._events.length > 0;
	}

	/**
	 * Checks if the object is a specific component type.
	 *
	 * @param {string} name
	 * @returns {boolean}
	 * @public
	 * @memberof Entity
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public is(name: string): boolean {
		return name.toLowerCase() === 'entity';
	}

	/**
	 * Evaluate if the entity is modified.
	 *
	 * @returns {boolean}
	 * @public
	 * @memberof Entity
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public isModified(): boolean {
		return this._modified;
	}

	/**
	 * Mark the entity as persisted.
	 *
	 * @public
	 * @memberof Entity
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public markAsPersisted(): void {
		this._modified = false;
		this.emit('persisted', this);
	}

	/**
	 * Remove an event listener.
	 *
	 * @param {string} event
	 * @param {EventListener} listener
	 * @returns {void}
	 * @public
	 * @memberof Entity
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public off(event: string, listener?: EventListener): void {
		this._emitter?.off(event, listener);
	}

	/**
	 * Register a new event listener.
	 *
	 * @param {string} event
	 * @param {EventListener} listener
	 * @returns {void}
	 * @public
	 * @memberof Entity
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public on(event: string, listener: EventListener): void {
		this.emitter.on(event, listener);
	}

	/**
	 * Register a new event listener that will be removed after the first event is emitted.
	 *
	 * @param {string} event
	 * @param {EventListener} listener
	 * @returns {void}
	 * @public
	 * @memberof Entity
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public once(event: string, listener: EventListener): void {
		this.emitter.once(event, listener);
	}

	/**
	 * Get the entity events.
	 *
	 * @returns {Array<DomainEvent<any>>}
	 * @public
	 * @memberof Entity
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public pullEvents(): Array<DomainEvent<any>> {
		const events = Array.from(this._events);
		this._events.length = 0;
		return events;
	}

	/**
	 * Dispose the entity.
	 *
	 * @returns void
	 * @public
	 * @memberof Entity
	 * @since 5.0.0
	 */
	public [Symbol.dispose]() {
		this.dispose();
	}

	/**
	 * Add an event.
	 *
	 * @param {DomainEvent<any>} event
	 * @returns {void}
	 * @public
	 * @memberof Entity
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected addEvent(event: DomainEvent<any>): void {
		if (this._events.length >= Entity.MAX_EVENTS) {
			throw new Error('Too many domain events recorded for entity.');
		}

		this._events.push(event);
	}

	/**
	 * Generate a new entity id object.
	 * This method must be implemented by the entity.
	 *
	 * @returns {Id}
	 * @throws {Error} If the method is not implemented.
	 * @protected
	 * @memberof Entity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected generateId(): Id {
		throw new Error('Not implemented');
	}

	/**
	 * Mark the entity as modified.
	 *
	 * @public
	 * @memberof EnhancedEntity
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected markAsModified(): void {
		this._modified = true;
		this.emit('modified', this);
	}

	/**
	 * Checks if an object is an entity.
	 *
	 * @param {*} e
	 * @returns {boolean}
	 * @public
	 * @static
	 * @memberof Entity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static isEntity(e: any): boolean {
		return e instanceof Entity;
	}
}
