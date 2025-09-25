/** Entities */
export { CollectionOfEnhancedEntity } from '@/core/deprecated/CollectionOfEnhancedEntity.js';
export { CollectionOfRelatedEnhancedEntity } from '@/core/deprecated/CollectionOfRelatedEnhancedEntity.js';
export { CollectionOfRelatedEntity } from '@/core/deprecated/CollectionOfRelatedEntity.js';
export { EnhancedEntity } from '@/core/deprecated/EnhancedEntity.js';
export { AbstractCollectionOfEntities } from '@/core/entities/AbstractCollectionOfEntities.js';
export { CollectionOfEntity } from '@/core/entities/CollectionOfEntity.js';
export { Entity } from '@/core/entities/Entity.js';
export { EntityID } from '@/core/entities/EntityID.js';
export { NumberEntityId } from '@/core/entities/ids/NumberEntityId.js';
export { StringEntityId } from '@/core/entities/ids/StringEntityId.js';
export { UUIDEntityId } from '@/core/entities/ids/UUIDEntityId.js';
export { UUIDv7EntityId } from '@/core/entities/ids/UUIDv7EntityId.js';
export { OptionalEntity } from '@/core/entities/OptionalEntity.js';

/** Value Objects */
export { AbstractCollectionOfValueObjects } from '@/core/vos/AbstractCollectionOfValueObjects.js';
export { CollectionOfValueObjects } from '@/core/vos/CollectionOfValueObjects.js';
export { ValueObject } from '@/core/vos/ValueObject.js';

/** Attributes */
export { Attribute } from '@/core/attributes/Attribute.js';
export { AbstractCollectionOfAttributes } from '@/core/deprecated/AbstractCollectionOfAttributes.js';
export { AbstractCollectionOfEnhancedAttributes } from '@/core/deprecated/AbstractCollectionOfEnhancedAttributes.js';
export { CollectionOfAttributes } from '@/core/deprecated/CollectionOfAttributes.js';
export { CollectionOfEnhancedAttributes } from '@/core/deprecated/CollectionOfEnhancedAttributes.js';
export { EnhancedAttribute } from '@/core/deprecated/EnhancedAttribute.js';

/** Result/monad pattern */
export { ResultAsync, Result } from '@/core/Result.js';
export { ResultChain } from '@/core/ResultChain.js';

/** Events */
export { DomainEvent } from '@/core/DomainEvent.js';
export { EventEmitter } from '@/core/EventEmitter.js';

/** Services */
export { ApplicationService } from '@/core/ApplicationService.js';
export { DomainService } from '@/core/DomainService.js';
export { InfraService } from '@/core/InfraService.js';
export { Service } from '@/core/Service.js';
export { ServiceProvider } from '@/core/ServiceProvider.js';

export { UseCase } from '@/core/deprecated/UseCase.js';

/** Specification */
export {
	AlwaysFalseSpecification,
	AlwaysTrueSpecification,
	AndSpecification,
	NotSpecification,
	OrSpecification,
	Specification,
} from '@/core/specification/Specification.js';
export type { ISpecification } from '@/core/specification/types/index.js';

/** Repositories */
export type {
	TransactionIsolationLevelType,
	BeginTransactionOptions,
	IDatabaseDriver,
	IRepository,
	IUnitOfWork,
} from '@/core/repositories/types/index.js';

export { AbstractRelationalRepository } from '@/core/repositories/AbstractRelationalRepository.js';
export { RelationalRepositoryBundle } from '@/core/repositories/RelationalRepositoryBundle.js';
export { RepositoryProvider } from '@/core/repositories/RepositoryProvider.js';

/** Application */
export { ApplicationMediator } from '@/core/application/ApplicationMediator.js';
export type {
	IApplicationMiddleware,
	IApplicationHandler,
	ApplicationContext,
	IMessage,
} from '@/core/application/types/index.js';

/** Errors */
export { ApplicationError } from '@/core/errors/ApplicationError.js';
export { ApplicationMediatorError } from '@/core/errors/ApplicationMediatorError.js';
export { BusinessRuleViolationError } from '@/core/errors/BusinessRuleViolationError.js';
export { DomainError } from '@/core/errors/DomainError.js';
export { EntityIdMismatchError } from '@/core/errors/EntityIdMismatchError.js';
export { InvalidNormalizationError } from '@/core/errors/InvalidNormalizationError.js';
export { InvalidPayloadError } from '@/core/errors/InvalidPayloadError.js';
export { InvalidPayloadSchemaError } from '@/core/errors/InvalidPayloadSchemaError.js';
export { InvalidSchemaError } from '@/core/errors/InvalidSchemaError.js';
export { InvalidSchemaNormalizationError } from '@/core/errors/InvalidSchemaNormalizationError.js';
export { RuntimeError } from '@/core/errors/RuntimeError.js';

export { FileLogStreamService } from '@/core/services/FileLogStreamService.js';
export { LoggerService } from '@/core/services/LoggerService.js';
export { OnGoingPromisesService } from '@/core/services/OnGoingPromisesService.js';

export type {
	IPromisesHandlerService,
	IFileLogService,
	ILoggerService,
	IStoreService,
} from '@/core/services/types/index.js';

export type {
	OnGoingPromisesServiceSettings,
	FileLogStreamServiceSettings,
	OnGoingPromisesServiceEntry,
	FileLogStreamServiceEntry,
	LoggerServiceSettings,
	LoggerServiceEntry,
	LoggerFn,
	LogLevel,
} from '@/core/services/schemas/index.js';

export {
	OnGoingPromisesServiceSettingsSchema,
	FileLogStreamServiceSettingsSchema,
	LoggerServiceSettingsSchema,
	LogLevelSchema,
	LoggerFnSchema,
} from '@/core/services/schemas/index.js';

export type { EnvironmentType } from '@/utils/types/index.js';

export {
	zodIssuesToDataIssues,
	lastAvailableString,
	sanitizeRecursively,
	slugifyAsUnderscore,
	commaStringAsArray,
	evaluateAbspath,
	normalizeSchema,
	evaluateSchema,
	generateString,
	slugifyAsDash,
	getTimestamp,
	randomString,
	splitAndTrim,
	parseAbspath,
	parseToJson,
	removeIndex,
	deleteKeys,
	parseEmpty,
	removeItem,
	displayLog,
	toRFC3339,
	preserve,
	mountURL,
	parseEnv,
	toArray,
	toJSON,
} from '@/utils/index.js';

export type {
	ObjectExportable,
	JSONExportable,
	TOrUndefined,
	TOrNullable,
	TDateInput,
	TOrAnother,
	TOrEmpty,
	TOrFalse,
	TObject,
	TOrNull,
} from '@/types/index.js';

export type {
	DomainErrorHiddenProp,
	ApplicationErrorJSON,
	IApplicationError,
	PreviousErrorJSON,
	RuntimeErrorJSON,
	DomainErrorJSON,
	IRuntimeError,
	PreviousError,
	IDomainError,
	DataIssues,
	DataIssue,
} from '@/core/errors/types/index.js';

export type {
	RelatedEnhancedEntity,
	ResultReturnType,
	EventListener,
	RelatedEntity,
	IEventEmitter,
	IDomainEvent,
	IValueObject,
	IAttribute,
	IComponent,
	ResultFn,
	IEntity,
} from '@/core/types/index.js';
