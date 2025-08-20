import type { TOrAnother } from '@/types';

import type { EnhancedEntity as BaseEnhancedEntity } from '../EnhancedEntity';
import type { DomainError } from '../errors/DomainError';
import type { Entity as BaseEntity } from '../Entity';
import type { EntityID } from '../EntityID';
import type { Result } from '../Result';

export type CollectionOfEntitiesIndex<ID, Value> = { id: ID; value?: Value };

export type EventListener = (...args: Array<any>) => void;

export interface IAttribute<Props extends Record<any, any> = Record<any, any>> {
	equals(a: IAttribute<Props> | undefined | null): boolean;
	clone(): IAttribute<Props>;
	hash(): string;
}

export interface IComponent {
	is(name: string): boolean;
}

export interface IDomainEvent<
	EventData extends Record<string, any> = Record<string, any>,
> {
	readonly issued_at: number;
	readonly data: EventData;
	readonly name: string;
	generateId(): string;
	readonly id: string;
}

export interface IEntity<ID extends EntityID<any>> {
	equals(e: IEntity<ID> | undefined | null): boolean;
	id: ID;
}

export type RelatedEnhancedEntity<
	ID extends EntityID<any>,
	Entity extends BaseEnhancedEntity<any, any>,
> = CollectionOfEntitiesIndex<ID, Entity>;

export type RelatedEntity<
	ID extends EntityID<any>,
	Entity extends BaseEntity<any, any>,
> = CollectionOfEntitiesIndex<ID, Entity>;

export type ResultFn<
	PrevData = any,
	NextData = any,
	NextError extends DomainError = DomainError,
> = (last: Result<PrevData, DomainError>) => ResultReturnType<NextData, NextError>;

export type ResultReturnType<
	NextData = any,
	NextError extends DomainError = DomainError,
> = TOrAnother<Result<NextData, NextError>, Promise<Result<NextData, NextError>>>;
