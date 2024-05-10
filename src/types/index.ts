import type { Entity as BaseEntity, EntityID } from '@/core';

export type PaginateQuery = {
	page: number;
	size: number;
};

export type SQL_ERROR_EVENT<Error = any> = {
	sql: string;
	values?: any[];
	error: Error;
};

export interface DomainErrorObject {
	code: number;
	name: string;
	message: string | null;
	hint: string | null;
	extra: Record<string, any> | null;
}

export type RelatedEntity<
	ID extends EntityID<any>,
	Entity extends BaseEntity<any, any>
> = {
	id: ID;
	entity: Entity | null;
};
