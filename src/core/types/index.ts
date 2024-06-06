import { EntityID } from '../EntityID';
import { Entity as BaseEntity } from '../Entity';

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
