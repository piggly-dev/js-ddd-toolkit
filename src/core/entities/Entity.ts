import type { EventListener, IEntity } from '@/core/types/index.js';

import { EntityID } from '@/core/entities/EntityID.js';
import { EventEmitter } from '@/core/EventEmitter.js';

/**
 * @file Base entity class.
 * @copyright Piggly Lab 2023
 */
export abstract class Entity<Props, Id extends EntityID<any>>
	implements IEntity<Id>
{
	/**
	 * The event emmiter.
	 *
	 * @type {EventEmitter}
	 * @public
	 * @memberof Entity
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _emmiter: EventEmitter;

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
	 * @public
	 * @constructor
	 * @memberof Entity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(props: Props, id?: Id) {
		this._id = id ?? this.generateId();
		this._props = props;

		this._emmiter = new EventEmitter();
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
	 * @returns {Entity<Props, Id>}
	 * @throws {Error} If the method is not implemented.
	 * @public
	 * @memberof Entity
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public clone(_?: Id): Entity<Props, Id> {
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
		this._emmiter.unsubscribeAll();
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
		this._emmiter.emit(event, ...args);
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
	public equals(e: Entity<Props, any> | undefined | null): boolean {
		if (e === null || e === undefined || e.is('entity') === false) {
			return false;
		}

		if (this === e) {
			return true;
		}

		return e._id.equals(this._id);
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
		this._emmiter.off(event, listener);
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
		this._emmiter.on(event, listener);
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
		this._emmiter.once(event, listener);
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
