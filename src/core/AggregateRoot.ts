import { EntityID } from './EntityID';
import { Entity } from './Entity';

/**
 * @file Aggregate root base class.
 * @copyright Piggly Lab 2023
 */
export abstract class AggregateRoot<Props, Id extends EntityID<any>> extends Entity<
	Props,
	Id
> {}
