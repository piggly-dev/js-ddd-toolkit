import type { EnhancedEntity as BaseEnhancedEntity } from '@/core/entities/EnhancedEntity.js';
import type { Entity as BaseEntity } from '@/core/entities/Entity.js';
import type { DomainError } from '@/core/errors/DomainError.js';
import type { EntityID } from '@/core/entities/EntityID.js';
import type { TOrAnother } from '@/types/index.js';
import type { Result } from '@/core/Result.js';

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

export interface IEntity<ID extends EntityID<any>> extends IComponent {
	equals(e: IEntity<ID> | undefined | null): boolean;
	off(event: string, listener?: EventListener): void;
	once(event: string, listener: EventListener): void;
	on(event: string, listener: EventListener): void;
	emit(event: string, ...args: any[]): void;
	clone(id?: ID): IEntity<ID>;
	markAsPersisted(): void;
	isModified(): boolean;
	dispose(): void;
	id: ID;
}

export interface IValueObject<
	Props extends Record<string, any> = Record<string, any>,
> extends IComponent {
	equals(a: IValueObject<Props> | undefined | null): boolean;
	props: Props;
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
