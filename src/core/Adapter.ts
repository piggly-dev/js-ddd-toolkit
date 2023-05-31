import BaseEntity from './Entity';

/**
 * @file An adapter to convert entities to persistence records and vice-versa.
 * @copyright Piggly Lab 2023
 */
export default abstract class Adapter<
	Entity extends BaseEntity<any>,
	PersistenceRecord extends Record<string, any>
> {
	/**
	 * Convert an entity to a persistence record.
	 *
	 * @param {Entity} entity
	 * @returns {PersistenceRecord}
	 * @public
	 * @abstract
	 * @memberof Adapter
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public abstract toPersistence(entity: Entity): PersistenceRecord;

	/**
	 * Convert a persistence record to an entity.
	 *
	 * @param {PersistenceRecord} record
	 * @returns {Entity}
	 * @public
	 * @abstract
	 * @memberof Adapter
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public abstract toEntity(record: PersistenceRecord): Entity;
}
