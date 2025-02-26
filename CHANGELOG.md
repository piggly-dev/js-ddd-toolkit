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
