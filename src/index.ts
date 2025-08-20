/** Entities */
export { AbstractCollectionOfEntities } from '@/core/entities/AbstractCollectionOfEntities';
export { CollectionOfEnhancedEntity } from '@/core/entities/CollectionOfEnhancedEntity';
export { CollectionOfEntity } from '@/core/entities/CollectionOfEntity';
export { CollectionOfRelatedEnhancedEntity } from '@/core/entities/CollectionOfRelatedEnhancedEntity';
export { CollectionOfRelatedEntity } from '@/core/entities/CollectionOfRelatedEntity';
export { EnhancedEntity } from '@/core/entities/EnhancedEntity';
export { Entity } from '@/core/entities/Entity';
export { EntityID } from '@/core/entities/EntityID';
export { NumberEntityId } from '@/core/entities/ids/NumberEntityId';
export { StringEntityId } from '@/core/entities/ids/StringEntityId';
export { UUIDEntityId } from '@/core/entities/ids/UUIDEntityId';
export { OptionalEntity } from '@/core/entities/OptionalEntity';

/** Value Objects */
export { AbstractCollectionOfValueObjects } from '@/core/vos/AbstractCollectionOfValueObjects';
export { CollectionOfValueObjects } from '@/core/vos/CollectionOfValueObjects';
export { ValueObject } from '@/core/vos/ValueObject';

/** Attributes */
export { AbstractCollectionOfAttributes } from '@/core/AbstractCollectionOfAttributes';
export { AbstractCollectionOfEnhancedAttributes } from '@/core/AbstractCollectionOfEnhancedAttributes';
export { Attribute } from '@/core/Attribute';
export { CollectionOfAttributes } from '@/core/CollectionOfAttributes';
export { CollectionOfEnhancedAttributes } from '@/core/CollectionOfEnhancedAttributes';
export { EnhancedAttribute } from '@/core/EnhancedAttribute';

/** Result/monad pattern */
export { Result } from '@/core/Result';
export { ResultChain } from '@/core/ResultChain';

/** Events */
export { DomainEvent } from '@/core/DomainEvent';
export { EventEmitter } from '@/core/EventEmitter';

/** Services */
export { ApplicationService } from '@/core/ApplicationService';
export { DomainService } from '@/core/DomainService';
export { InfraService } from '@/core/InfraService';
export { Service } from '@/core/Service';
export { ServiceProvider } from '@/core/ServiceProvider';

export { UseCase } from '@/core/UseCase';

/** Errors */
export { ApplicationError } from '@/core/errors/ApplicationError';
export { BusinessRuleViolationError } from '@/core/errors/BusinessRuleViolationError';
export { DomainError } from '@/core/errors/DomainError';
export { EntityIdMismatchError } from '@/core/errors/EntityIdMismatchError';
export { InvalidPayloadError } from '@/core/errors/InvalidPayloadError';
export { InvalidPayloadSchemaError } from '@/core/errors/InvalidPayloadSchemaError';
export { InvalidSchemaError } from '@/core/errors/InvalidSchemaError';
export { RuntimeError } from '@/core/errors/RuntimeError';

export { DateParser } from '@/utils/parsers/DateParser';

export { CryptoService } from '@/core/services/CryptoService';
export { FileLogStreamService } from '@/core/services/FileLogStreamService';
export { JWTBuilderService } from '@/core/services/JWTBuilderService';
export { LoggerService } from '@/core/services/LoggerService';
export { OnGoingPromisesService } from '@/core/services/OnGoingPromisesService';

export { IStoreService } from '@/core/services/types';

export {
	OnGoingPromisesServiceSettingsSchema,
	FileLogStreamServiceSettingsSchema,
	JWTBuilderServiceSettingsSchema,
	OnGoingPromisesServiceSettings,
	FileLogStreamServiceSettings,
	OnGoingPromisesServiceEntry,
	LoggerServiceSettingsSchema,
	JWTBuilderServiceSettings,
	FileLogStreamServiceEntry,
	JWTBuilderServiceEntry,
	LoggerServiceSettings,
	LoggerServiceEntry,
	LogLevelSchema,
	LoggerFnSchema,
	LoggerFn,
	LogLevel,
} from '@/core/services/schemas';

export { EnvironmentType } from '@/utils/types';

export {
	lastAvailableString,
	sanitizeRecursively,
	slugifyAsUnderscore,
	commaStringAsArray,
	evaluateAbspath,
	evaluateSchema,
	generateString,
	loadConfigIni,
	slugifyAsDash,
	getTimestamp,
	randomString,
	splitAndTrim,
	parseAbspath,
	parseToJson,
	removeIndex,
	loadDotEnv,
	deleteKeys,
	parseEmpty,
	removeItem,
	displayLog,
	toRFC3339,
	loadYaml,
	preserve,
	toMoment,
	mountURL,
	toArray,
	toJSON,
} from '@/utils';

export type {
	ObjectExportable,
	JSONExportable,
	TOrUndefined,
	TOrNullable,
	TOrAnother,
	TDateInput,
	TOrFalse,
	TOrEmpty,
	TOrNull,
	TObject,
} from '@/types';

export type {
	DomainErrorHiddenProp,
	ApplicationErrorJSON,
	PreviousErrorJSON,
	IApplicationError,
	RuntimeErrorJSON,
	DomainErrorJSON,
	PreviousError,
	IRuntimeError,
	IDomainError,
} from '@/core/errors/types';

export type {
	RelatedEnhancedEntity,
	ResultReturnType,
	RelatedEntity,
	EventListener,
	IDomainEvent,
	IAttribute,
	ResultFn,
	IEntity,
} from '@/core/types';
