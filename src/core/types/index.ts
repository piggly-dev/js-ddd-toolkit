import type { TOrAnother } from '@/types';
import type { Entity as BaseEntity } from '../Entity';
import type { EntityID } from '../EntityID';
import type { EnhancedEntity as BaseEnhancedEntity } from '../EnhancedEntity';
import type { Result } from '../Result';
import type { DomainError } from '../errors/DomainError';

export type RelatedEntity<
	ID extends EntityID<any>,
	Entity extends BaseEntity<any, any>
> = CollectionOfEntitiesIndex<ID, Entity>;

export type RelatedEnhancedEntity<
	ID extends EntityID<any>,
	Entity extends BaseEnhancedEntity<any, any>
> = CollectionOfEntitiesIndex<ID, Entity>;

export interface IDomainEvent<
	EventData extends Record<string, any> = Record<string, any>
> {
	readonly id: string;
	readonly name: string;
	readonly data: EventData;
	readonly issued_at: number;
	generateId(): string;
}

export type EventListener = (...args: Array<any>) => void;

export type ResultFn<
	PrevData = any,
	NextData = any,
	NextError extends DomainError = DomainError
> = (last: Result<PrevData, DomainError>) => ResultReturnType<NextData, NextError>;

export type ResultReturnType<
	NextData = any,
	NextError extends DomainError = DomainError
> = TOrAnother<Result<NextData, NextError>, Promise<Result<NextData, NextError>>>;

export type CollectionOfEntitiesIndex<ID, Value> = { id: ID; value?: Value };

export interface IEntity<ID extends EntityID<any>> {
	id: ID;
	equals(e: IEntity<ID> | undefined | null): boolean;
}
