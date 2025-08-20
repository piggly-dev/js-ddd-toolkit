import moment from 'moment-timezone';

import type { IEntity } from '@/core/types/index.js';

import { EntityID } from '@/core/entities/EntityID.js';
import { Entity } from '@/core/entities/Entity.js';

/**
 * @file Base entity class.
 * @copyright Piggly Lab 2023
 */
export abstract class EnhancedEntity<
		Props extends { updated_at: moment.Moment },
		Id extends EntityID<any>,
	>
	extends Entity<Props, Id>
	implements IEntity<Id>
{
	/**
	 * Indicates if the entity was modified.
	 *
	 * @type {boolean}
	 * @protected
	 * @memberof EnhancedEntity
	 * @since 3.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _modified: boolean;

	/**
	 * Creates an instance of EnhancedEntity.
	 *
	 * @param {props} props
	 * @param {Id | undefined} id
	 * @public
	 * @constructor
	 * @memberof EnhancedEntity
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(props: Props, id?: Id) {
		super(props, id);
		this._modified = false;
	}

	/**
	 * Evaluate if the entity is modified.
	 *
	 * @returns {boolean}
	 * @public
	 * @memberof EnhancedEntity
	 * @since 3.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public isModified(): boolean {
		return this._modified;
	}

	/**
	 * Mark the entity as persisted.
	 *
	 * @public
	 * @memberof EnhancedEntity
	 * @since 3.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public markAsPersisted(): void {
		this._modified = false;
		this.emit('persisted', this);
	}

	/**
	 * Mark the entity as modified.
	 *
	 * @public
	 * @memberof EnhancedEntity
	 * @since 3.1.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected markAsModified(): void {
		this._props.updated_at = moment().utc();
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
		return e instanceof EnhancedEntity;
	}
}
