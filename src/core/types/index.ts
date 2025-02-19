import type { TOrAnother } from '@/types';
import type { Entity as BaseEntity } from '../Entity';
import type { EntityID } from '../EntityID';
import type { Result } from '../Result';
import type { DomainError } from '../errors/DomainError';

export type RelatedEntity<
	ID extends EntityID<any>,
	Entity extends BaseEntity<any, any>
> = {
	id: ID;
	entity: Entity | null;
};

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
	Data = any,
	Last = any,
	Error extends DomainError = DomainError
> = (
	last?: Result<Last, Error>
) => TOrAnother<Result<Data, Error>, Promise<Result<Data, Error>>>;
