import crypto from 'crypto';

import { shallowEqual } from 'shallow-equal-object';

import type { EventListener, IAttribute } from '@/core/types/index.js';

import { EventEmitter } from '@/core/EventEmitter.js';

/**
 * @file Base attribute class.
 * @copyright Piggly Lab 2025
 * @since 3.4.0
 */
export class Attribute<Props extends Record<any, any>> implements IAttribute<Props> {
	/**
	 * The event emmiter.
	 *
	 * @type {EventEmitter}
	 * @protected
	 * @memberof EnhancedAttribute
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _emitter: EventEmitter;

	/**
	 * Indicates if the attribute was modified.
	 *
	 * @type {boolean}
	 * @protected
	 * @memberof EnhancedAttribute
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _modified: boolean;

	/**
	 * The attribute props.
	 *
	 * @type {Props}
	 * @protected
	 * @readonly
	 * @memberof Attribute
	 * @since 3.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _props: Props;

	/**
	 * Creates an instance of Attribute.
	 * The props are frozen to avoid any change.
	 * You should create a new instance with a static method.
	 *
	 * @param {Props} props
	 * @protected
	 * @constructor
	 * @memberof Attribute
	 * @since 3.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected constructor(props: Props) {
		this._props = props;
		this._modified = false;
		this._emitter = new EventEmitter();
	}

	/**
	 * Clone the attribute.
	 *
	 * @returns {this}
	 * @public
	 * @memberof Attribute
	 * @since 3.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public clone(): this {
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
		this._emitter.unsubscribeAll();
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
		this._emitter.emit(event, ...args);
	}

	/**
	 * Checks if two attributes are equal.
	 *
	 * @param {(Attribute|undefined|null)} [attr]
	 * @returns {boolean}
	 * @public
	 * @memberof Attribute
	 * @since 3.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public equals(attr: IAttribute<Props> | undefined | null): boolean {
		if (
			attr === null ||
			attr === undefined ||
			!Attribute.isAttribute(attr) ||
			attr.is('attribute') === false
		) {
			return false;
		}

		return shallowEqual(this._props, attr.toJSON());
	}

	/**
	 * Hash the attribute.
	 * It should be calculated at runtime since the props can change.
	 *
	 * @returns {string}
	 * @public
	 * @memberof Attribute
	 * @since 3.4.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public hash(): string {
		return crypto
			.createHash('sha256')
			.update(JSON.stringify(this._props))
			.digest('hex');
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
		return name.toLowerCase() === 'attribute';
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
		this._emitter.off(event, listener);
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
		this._emitter.on(event, listener);
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
		this._emitter.once(event, listener);
	}

	/**
	 * Return the props as a JSON object.
	 *
	 * @returns {Props}
	 * @public
	 * @memberof Attribute
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public toJSON(): Props {
		return Object.freeze(this._props);
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
	 * Checks if an object is an attribute.
	 *
	 * @param {*} e
	 * @returns {boolean}
	 * @public
	 * @static
	 * @memberof Attribute
	 * @since 3.4.1
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static isAttribute(e: any): boolean {
		return e instanceof Attribute;
	}
}
