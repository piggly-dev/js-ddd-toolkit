import type { EnhancedEntity as BaseEnhancedEntity } from '@/core/deprecated/EnhancedEntity.js';
import type { Entity as BaseEntity } from '@/core/entities/Entity.js';
import type { DomainError } from '@/core/errors/DomainError.js';
import type { EntityID } from '@/core/entities/EntityID.js';
import type { TOrAnother } from '@/types/index.js';
import type { Result } from '@/core/Result.js';

export type CollectionOfEntitiesIndex<ID, Value> = { id: ID; value?: Value };

export type EventListener = (...args: Array<any>) => void;

export interface IAttribute<Props extends Record<any, any> = Record<any, any>>
	extends IEventEmitter,
		IComponent {
	equals(a: IAttribute<Props> | undefined | null): boolean;
	toJSON(): Readonly<any>;
	markAsPersisted(): void;
	isModified(): boolean;
	dispose(): void;
	hash(): string;
	clone(): this;
}

export interface IComponent {
	is(name: string): boolean;
}

export interface IDomainEvent<
	EventData extends Record<string, any> = Record<string, any>,
> {
	readonly data: Readonly<EventData>;
	readonly issued_at: number;
	readonly name: string;
	generateId(): string;
	readonly id: string;
}

export interface IEntity<ID extends EntityID<any>>
	extends IEventEmitter,
		IComponent {
	equals(e: IEntity<ID> | undefined | null): boolean;
	markAsPersisted(): void;
	isModified(): boolean;
	clone(id?: ID): this;
	dispose(): void;
	id: ID;
}

export type IEventEmitter = {
	emit(event: string, ...args: any[]): void;
	off(event: string, listener?: EventListener): void;
	on(event: string, listener: EventListener): void;
	once(event: string, listener: EventListener): void;
};

export interface IValueObject<
	Props extends Record<string, any> = Record<string, any>,
> extends IComponent {
	equals(a: IValueObject<any> | undefined | null): boolean;
	props: Readonly<Props>;
}

/**
 * @deprecated Use Entity instead.
 */
export type RelatedEnhancedEntity<
	ID extends EntityID<any>,
	Entity extends BaseEnhancedEntity<any, any>,
> = CollectionOfEntitiesIndex<ID, Entity>;

/**
 * @deprecated Use Entity instead.
 */
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
