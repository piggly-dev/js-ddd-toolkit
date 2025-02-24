export { Entity } from '@/core/Entity';
export { OptionalEntity } from '@/core/OptionalEntity';
export { EnhancedEntity } from '@/core/EnhancedEntity';
export { EntityID } from '@/core/EntityID';
export { ValueObject } from '@/core/ValueObject';
export { EnhancedAttribute } from '@/core/EnhancedAttribute';
export { Result } from '@/core/Result';
export { ResultChain } from '@/core/ResultChain';
export { AggregateRoot } from '@/core/AggregateRoot';
export { SchemaValidator } from '@/core/SchemaValidator';

export { CollectionOfEntity } from '@/core/CollectionOfEntity';
export { CollectionOfEnhancedEntity } from '@/core/CollectionOfEnhancedEntity';
export { CollectionOfRelatedEntity } from '@/core/CollectionOfRelatedEntity';
export { CollectionOfRelatedEnhancedEntity } from '@/core/CollectionOfRelatedEnhancedEntity';
export { AbstractCollectionOfEntities } from '@/core/AbstractCollectionOfEntities';

export { CollectionOfValueObjects } from '@/core/CollectionOfValueObjects';
export { MapCollectionOfValueObjects } from '@/core/MapCollectionOfValueObjects';

export { Adapter } from '@/core/Adapter';

export { DomainEvent } from '@/core/DomainEvent';
export { EventEmmiter } from '@/core/EventEmmiter';

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
export { InvalidPayloadError } from '@/core/errors/InvalidPayloadError';
export { EntityIdMismatchError } from '@/core/errors/EntityIdMismatchError';

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

export type {
	RelatedEntity,
	RelatedEnhancedEntity,
	IDomainEvent,
	EventListener,
	ResultFn,
	ResultReturnType,
} from '@/core/types';
