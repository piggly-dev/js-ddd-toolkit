export { Entity } from '@/core/Entity';
export { EntityID } from '@/core/EntityID';
export { ValueObject } from '@/core/ValueObject';
export { Result } from '@/core/Result';
export { AggregateRoot } from '@/core/AggregateRoot';
export { CollectionOfEntity } from '@/core/CollectionOfEntity';
export { CollectionOfValueObjects } from '@/core/CollectionOfValueObjects';
export { MapCollectionOfValueObjects } from '@/core/MapCollectionOfValueObjects';
export { CollectionOfRelatedEntity } from '@/core/CollectionOfRelatedEntity';
export { SchemaValidator } from '@/core/SchemaValidator';

export { Adapter } from '@/core/Adapter';

export { DomainEvent } from '@/core/DomainEvent';

export { Service } from '@/core/Service';
export { DomainService } from '@/core/DomainService';
export { ApplicationService } from '@/core/ApplicationService';
export { InfraService } from '@/core/InfraService';
export { ServiceProvider } from '@/core/ServiceProvider';

export { UseCase } from '@/core/UseCase';

export { DomainError } from '@/core/errors/DomainError';
export { ApplicationError } from '@/core/errors/ApplicationError';
export { RuntimeError } from '@/core/errors/RuntimeError';
export { InvalidSchemaError } from '@/core/errors/InvalidSchemaError';
export { BusinessRuleViolationError } from '@/core/errors/BusinessRuleViolationError';

export { DateParser } from '@/utils/parsers/DateParser';

export {
	commaStringAsArray,
	lastAvailableString,
	deleteKeys,
	getTimestamp,
	parseEmpty,
	preserve,
	parseToJson,
	removeItem,
	removeIndex,
	randomString,
	toJSON,
	toArray,
	toMoment,
	toRFC3339,
	mountURL,
	splitAndTrim,
	schemaValidator,
} from '@/utils';

export type {
	TOrNull,
	TOrUndefined,
	TOrNullable,
	TOrAnother,
	TOrFalse,
	TOrEmpty,
	TDateInput,
	TObject,
	JSONExportable,
	ObjectExportable,
} from '@/types';

export type {
	DomainErrorJSON,
	ApplicationErrorJSON,
	RuntimeErrorJSON,
	PreviousErrorJSON,
	PreviousError,
	DomainErrorHiddenProp,
	IDomainError,
	IApplicationError,
	IRuntimeError,
} from '@/core/errors/types';

export type { RelatedEntity, IDomainEvent } from '@/core/types';
