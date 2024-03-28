import Entity from './Entity';
import EntityID from './EntityID';

/**
 * @file Aggregate root base class.
 * @copyright Piggly Lab 2023
 */
export default abstract class AggregateRoot<
	Props,
	Id extends EntityID
> extends Entity<Props, Id> {}
