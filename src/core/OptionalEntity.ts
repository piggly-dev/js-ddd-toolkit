import { EntityIdMismatchError } from './errors/EntityIdMismatchError';
import { DomainError } from './errors/DomainError';
import { EntityID } from './EntityID';
import { Result } from './Result';
import { IEntity } from './types';

/**
 * @file Optional entity.
 * @copyright Piggly Lab 2025
 */
export class OptionalEntity<
	Entity extends IEntity<ID>,
	ID extends EntityID<any> = EntityID<any>,
> {
	/**
	 * The pack of the entity.
	 *
	 * @type {{ id: ID; entity?: Entity }}
	 * @public
	 * @readonly
	 * @memberof OptionalEntity
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	private _pack: { id: ID; entity?: Entity };

	/**
	 * Creates an instance of OptionalEntity.
	 *
	 * @param {ID} id The identifier of the entity.
	 * @param {Entity} entity The entity.
	 * @public
	 * @constructor
	 * @memberof OptionalEntity
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(id: ID, entity?: Entity) {
		this._pack = { id, entity };
	}

	/**
	 * Get the entity.
	 *
	 * @type {Entity | undefined}
	 * @public
	 * @readonly
	 * @memberof OptionalEntity
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get entity(): undefined | Entity {
		return this._pack.entity;
	}

	/**
	 * Get the identifier of the entity.
	 *
	 * @type {ID}
	 * @public
	 * @readonly
	 * @memberof OptionalEntity
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get id(): ID {
		return this._pack.id;
	}

	/**
	 * Get the entity.
	 *
	 * @type {Entity}
	 * @public
	 * @readonly
	 * @memberof OptionalEntity
	 * @throws {Error} If the entity is not present.
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get knowableEntity(): Entity {
		if (this._pack.entity === undefined) {
			throw new Error('Entity is not present.');
		}

		return this._pack.entity;
	}

	/**
	 * Clone the optional entity.
	 *
	 * @returns {OptionalEntity<Entity, ID>} The cloned optional entity.
	 * @public
	 * @memberof OptionalEntity
	 * @since 3.3.2
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public clone(): OptionalEntity<Entity, ID> {
		return new OptionalEntity<Entity, ID>(this._pack.id, this._pack.entity);
	}

	/**
	 * Check if the entity is not present.
	 *
	 * @type {boolean}
	 * @public
	 * @readonly
	 * @memberof OptionalEntity
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public isAbsent(): boolean {
		return this._pack.entity === undefined;
	}

	/**
	 * Check if the entity is present.
	 *
	 * @type {boolean}
	 * @public
	 * @readonly
	 * @memberof OptionalEntity
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public isPresent(): boolean {
		return this._pack.entity !== undefined;
	}

	/**
	 * Load the entity.
	 *
	 * @param {Entity} entity The entity.
	 * @public
	 * @memberof OptionalEntity
	 * @since 3.3.0
	 * @throws {Error} If the entity ID does not match.
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public load(entity: Entity): Entity {
		if (this._pack.id.equals(entity.id) === false) {
			throw new Error('Entity ID does not match.');
		}

		this._pack.entity = entity;
		return entity;
	}

	/**
	 * Load the entity.
	 *
	 * @param {Entity} entity The entity.
	 * @returns {Result<Entity, DomainError>} The result of the operation.
	 * @public
	 * @memberof OptionalEntity
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public safeLoad(entity: Entity): Result<Entity, DomainError> {
		if (this._pack.id.equals(entity.id) === false) {
			return Result.fail(new EntityIdMismatchError());
		}

		this._pack.entity = entity;
		return Result.ok(entity);
	}

	/**
	 * Check if the entity is equal to another entity.
	 *
	 * @param {Entity} entity The entity to compare.
	 * @returns {boolean} True if the entity is equal, false otherwise.
	 * @public
	 * @memberof OptionalEntity
	 * @since 3.3.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected isEqual(entity: Entity): boolean {
		return this._pack.id.equals(entity.id);
	}
}
