/** Entities */
export { CollectionOfEnhancedEntity } from '@/core/deprecated/CollectionOfEnhancedEntity';
export { CollectionOfRelatedEnhancedEntity } from '@/core/deprecated/CollectionOfRelatedEnhancedEntity';
export { CollectionOfRelatedEntity } from '@/core/deprecated/CollectionOfRelatedEntity';
export { EnhancedEntity } from '@/core/deprecated/EnhancedEntity';
export { AbstractCollectionOfEntities } from '@/core/entities/AbstractCollectionOfEntities';
export { CollectionOfEntity } from '@/core/entities/CollectionOfEntity';
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
export { Attribute } from '@/core/attributes/Attribute';
export { AbstractCollectionOfAttributes } from '@/core/deprecated/AbstractCollectionOfAttributes';
export { AbstractCollectionOfEnhancedAttributes } from '@/core/deprecated/AbstractCollectionOfEnhancedAttributes';
export { CollectionOfAttributes } from '@/core/deprecated/CollectionOfAttributes';
export { CollectionOfEnhancedAttributes } from '@/core/deprecated/CollectionOfEnhancedAttributes';
export { EnhancedAttribute } from '@/core/deprecated/EnhancedAttribute';

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

export { UseCase } from '@/core/deprecated/UseCase';

/** Repositories */
export {
	TransactionIsolationLevelType,
	BeginTransactionOptions,
	IDatabaseDriver,
	IRepository,
	IUnitOfWork,
} from '@/core/repositories/types';

export { AbstractRelationalRepository } from '@/core/repositories/AbstractRelationalRepository';
export { RelationalRepositoryBundle } from '@/core/repositories/RelationalRepositoryBundle';
export { RepositoryProvider } from '@/core/repositories/RepositoryProvider';

/** Application */
export { ApplicationMediator } from '@/core/application/ApplicationMediator';

/** Errors */
export { ApplicationError } from '@/core/errors/ApplicationError';
export { ApplicationMediatorError } from '@/core/errors/ApplicationMediatorError';
export { BusinessRuleViolationError } from '@/core/errors/BusinessRuleViolationError';
export { DomainError } from '@/core/errors/DomainError';
export { EntityIdMismatchError } from '@/core/errors/EntityIdMismatchError';
export { InvalidNormalizationError } from '@/core/errors/InvalidNormalizationError';
export { InvalidPayloadError } from '@/core/errors/InvalidPayloadError';
export { InvalidPayloadSchemaError } from '@/core/errors/InvalidPayloadSchemaError';
export { InvalidSchemaError } from '@/core/errors/InvalidSchemaError';
export { InvalidSchemaNormalizationError } from '@/core/errors/InvalidSchemaNormalizationError';
export { RuntimeError } from '@/core/errors/RuntimeError';

export { CryptoService } from '@/core/services/CryptoService';
export { FileLogStreamService } from '@/core/services/FileLogStreamService';
export { JWTBuilderService } from '@/core/services/JWTBuilderService';
export { LoggerService } from '@/core/services/LoggerService';
export { OnGoingPromisesService } from '@/core/services/OnGoingPromisesService';

export {
	IPromisesHandlerService,
	IJWTBuilderService,
	IFileLogService,
	ILoggerService,
	IStoreService,
	JWTPayload,
} from '@/core/services/types';

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
	zodIssuesToDataIssues,
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
	mountURL,
	toArray,
	toJSON,
} from '@/utils';

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
} from '@/types';

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
} from '@/core/errors/types';

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
} from '@/core/types';

export type {
	ApplicationMiddlewareFn,
	ApplicationHandlerFn,
	ApplicationContext,
	IMessage,
} from '@/core/application/types';
