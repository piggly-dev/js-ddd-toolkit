# Changelog

## 1.0.0 at `2023-05-31`

* First release.

## 1.0.1 at `2023-06-03`

* [Fix] Type signature at DatabaseContext.

## 1.0.2 at `2023-06-06`

* [Fix] Type signature for Adapter.

## 1.1.0 at `2023-06-07`

* [Change] UnitOfWork has connection, Repository has any context between this connection.

## 1.1.1 / 1.1.2 / 1.1.3 at `2023-06-07`

* [Fix] Type signature for Repository.

## 1.1.4 / 1.1.5 at `2023-06-08`

* [Fix] Type signature for Unif of Work.
* [Add] `reload()` method to Repository.

## 1.2.0 at `2023-10-26`

* [Add] A very simple base class for Repository when using SQL;
* [Add] A very simple interface for UnitOfWork, allow to customize it as needed;
* [Update] Dependencies to latest version.

## 2.0.0 at `2024-03-27`

* [Remove] All classes related to database/repositories;
* [Add] A new class to handle schema validation;
* [Add] A new Result class for handling error or success of a return value;
* [Add] UseCase abstract class;
* [Update] Domain error without extends Error;
* [Update] Make EntityID more flexible.

## 2.0.1 at `2024-03-28`

* [Fix] Type signature for AggregateRoot class;
* [Fix] Type signature for CollectionOfEntity class.

## 2.0.2 at `2024-01-11`

* [Add] `schemaValidator` function to validate schema without a class.

## 2.1.0 at `2024-05-10`

* [Add] `CollectionOfRelatedEntity` class to handle collections of related entities.

## 2.1.1 at `2024-05-18`

* [Add] Methods `get` and `has` to `ServiceProvider`.

## 2.1.2 at `2024-05-29`

* [Add] Methods `replace` and `unregister` to `ServiceProvider`.

## 3.0.0 at `2024-06-06`

* [Add] New errors classes for handling errors;
* [Add] `MapCollectionOfValueObjects` allowing to map a collection of value objects;
* [Remove] Dependencies on `@piggly/event-bus`;
* [Export] Full compatibility with ESM and CommonJS;
* [Add] Some methods for many classes;
* [Update] Dependencies to latest version.

## 3.0.1 at `2024-06-07`

* [Fix] ESM/CommonJS/Types compatibility.

## 3.0.2 at `2024-06-11`

* [Fix] Allow empty hidden properties in `toJSON` method for `DomainError` and `RuntimeError`.

## 3.0.3 at `2024-06-18`

* [Fix] Allow extra property on `BusinessRuleViolationError`.

## 3.0.4 at `2024-06-19`

* [Fix] Parse last available string when string has a separator;
* [Add] `InvalidPayloadError`.

## 3.0.5 at `2024-10-30`

* [Add] Simple class for `EventEmmiter`;
* [Update] Vulnerabilities on dependecies.

## 3.1.0 at `2025-01-27`

* [Add] Enhanced classes for `Entity` and `Attribute`;
* [Update] Vulnerabilities on dependecies.

## 3.1.1 at `2025-01-27`

* [Add] Enhanced classes for `CollectionOfEntity`.

## 3.2.0 at `2025-02-19`

* [Add] `ResultChain` class, which allows to chain multiple results and handle errors;
* [Update] `DomainError` class, now allows to create domain errors with context.

## 3.2.1 at `2025-02-19`

* [Fix] Type signature for `ResultChain`.

## 3.2.2 at `2025-02-19`

* [Fix] Contexts for errors are protected now.

## 3.3.0 at `2025-02-24`

* [Add] `OptionalEntity` class to handle optional entities;
* [Add] Create a new abstract class `AbstractCollectionOfEntities` by using `OptionalEntity`;
* [Compatibility] All collection methods existing before are kept with the same input/output;
* [Compatibility] All collection classes extends `CollectionOfEntity` as an alias for compatibility;
* [Update] `ResultChain` can be cancelled by calling `cancel()` method inside a chain.

## 3.3.1 at `2025-02-24`

* [Fix] Typing fixing for `EnhancedEntity`.

## 3.3.2 at `2025-02-24`

* [Add] `clone()` method to collections and `OptionalEntity`;
* [Add] `appendRaw()` method to collections.

## 3.4.0 at `2025-02-25`

* [Add] `CollectionOfAttributes` class to handle collections of attributes;
* [Add] `AbstractCollectionOfAttributes` class to handle collections of attributes;
* [Add] `Attribute` class to handle attributes;
* [Add] `IAttribute` type to handle attributes;

## 3.5.0 at `2025-02-25`

* [Add] `EnhancedAttribute` class to handle enhanced attributes;
* [Add] `AbstractCollectionOfEnhancedAttributes` class to handle collections of enhanced attributes.

## 3.6.0 at `2025-02-26`

* [Export] Enhanced attributes and collections.
* 😭 Sorry for lot of version tags, I'm under too much pressure right now.

## 3.7.0 at `2025-02-28`

* [Add] Allow to get/remove an attribute by its hash from the collection.

## 3.7.1 at `2025-03-01`

* [Fix] `CollectionOfEnhancedAttributes` should extend `AbstractCollectionOfEnhancedAttributes`.

## 4.0.0 at `2025-03-07`

* [Breaking] Remove `joi` as a dependency;
* [Breaking] Remove `SchemaValidator` class;
* [Breaking] Remove `schemaValidator` function, use `evaluateSchema` instead;
* [Add] `zod` as a dependency, add `evaluateSchema` function as zod compatible, and add `InvalidPayloadSchemaError` error;
* [Add] `LoggerService` class to handle logging, moved from `@piggly/fastify-chassis`;
* [Add] `JWTBuilderService` class to handle JWT (`jose` is optional dependency, should be installed when needed), moved from `@piggly/fastify-chassis`;
* [Add] `CryptoService` class to handle crypto (`bcrypt` is optional dependency, should be installed when needed), moved from `@piggly/fastify-chassis`.
* [Add] `EnvironmentType` type to handle environment types.
* [Add] `loadConfigIni`, `loadDotEnv` and `loadYaml` (`js-yaml` and `dotenv` are optional dependencies, should be installed when needed) functions to handle configuration files.
* [Add] `sanitizeRecursively` function to sanitize a param recursively.

## 4.1.0 at `2025-04-14`

* [Update] Overall dependecies updates;
* [Change] `InvalidSchemaError` now extends `BusinessRuleViolationError`;
* [Change] Options for `LoggerService` class without breaking changes;
* [Fix] Overall typing issues;
* [Fix] `toJSON` method must have optional parameters at `ApplicationError` class;
* [Add] `debug` dependecy to display debug logs;
* [Add] `FileLogStreamService` class to handle file logging with `LoggerService`;
* [Add] `OnGoingPromisesService` class to handle ongoing promises on `LoggerService`;
* [Add] `evaluateAbspath` and `parseAbspath` utility functions to handle abspath;
* [Add] `displayLog` utility function to handle log display;
* [Add] Schemas for services settings.

## 4.1.1 at `2025-04-14`

* [Fix] Typing issues. Updating `tsc-alias` broke the types build.

## 4.1.2 at `2025-04-15`

* [Fix] Build issues. Updating `tsc-alias` broke all builds.

## 4.1.3 at `2025-04-15`

* [Fix] `toJSON` method now can have optional parameters.

## 4.1.4 at `2025-05-23`

* [Fix] `toJSON` method now can have optional parameters.

## 4.1.5 at `2025-05-23`

* [Fix] `toJSON` must check if `hidden` is an array.

## 4.1.6 at `2025-08-12`

* [Update] Dependencies to latest version;
* [Fix] Overall typing issues.

## 4.2.0 at `2025-08-12`

* [Fix] Overall typing issues with Zod;
* [Fix] Build issues for declaration files.
