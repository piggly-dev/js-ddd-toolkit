# Domain-Driven Design Toolkit for NodeJS applications

![Typescript](https://img.shields.io/badge/language-typescript-blue?style=for-the-badge) ![NPM](https://img.shields.io/npm/v/@piggly/ddd-toolkit?style=for-the-badge) [![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=for-the-badge)](LICENSE)

An ESM/CommonJS toolkit providing comprehensive Domain-Driven Design patterns and building blocks for NodeJS applications. This library offers a complete implementation of DDD tactical patterns including Entities, Value Objects, Attributes, Domain Events, Repositories with Unit of Work, and more.

## Features

### Core DDD Building Blocks

- **Entities & Aggregates**: Rich domain entities with built-in event emission;
- **Value Objects**: Immutable value objects with equality comparison;
- **Attributes**: Mutable attributes with equality comparison;
- **Domain Events**: Event-driven architecture support with EventEmitter;
- **Repository Pattern**: Complete repository implementation with Unit of Work;
- **Result Pattern**: Railway-oriented programming for error handling;
- **Application Services**: Service layer abstractions with dependency injection.

### Key Capabilities

- ✅ Full TypeScript support with comprehensive type definitions;
- ✅ Dual ESM/CommonJS module support;
- ✅ Built-in event sourcing capabilities;
- ✅ Transaction management with Unit of Work;
- ✅ Repository provider for IoC/DI;
- ✅ Result type with chaining, mapping, and error handling;
- ✅ Service provider for dependency management;
- ✅ Collection classes for entities and value objects;
- ✅ Comprehensive error handling system.

## Installation

```bash
npm install @piggly/ddd-toolkit
```

## Quick Start

### Entities

```typescript
import { Entity, UUIDEntityId } from '@piggly/ddd-toolkit';

interface UserProps {
  name: string;
  email: string;
}

class User extends Entity<UserProps, UUIDEntityId> {
  public static create(props: UserProps): User {
    const id = UUIDEntityId.generate();
    return new User(props, id);
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }
}
```

### Value Objects

```typescript
import { ValueObject } from '@piggly/ddd-toolkit';

interface EmailProps {
  value: string;
}

class EmailValueObject extends ValueObject<EmailProps> {
  public static create(email: string): Result<Email> {
    if (!this.isValid(email)) {
      return Result.fail(new Error('Invalid email'));
    }
    return Result.ok(new Email({ value: email }));
  }

  private static isValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  get value(): string {
    return this.props.value;
  }
}
```

### Attributes

```typescript

import { Attribute } from '@piggly/ddd-toolkit';

interface EmailProps {
  value: string;
}

class EmailAttribute extends Attribute<EmailProps> {
  public static create(email: string): Result<Email> {
    if (!this.isValid(email)) {
      return Result.fail(new Error('Invalid email'));
    }
    return Result.ok(new Email({ value: email }));
  }

  private static isValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  public change(email: string): Result<Email> {
    if (!this.isValid(email)) {
      return Result.fail(new Error('Invalid email'));
    }

    this.props.value = email;
    this.markAsModified();

    return Result.ok(this);
  }

  get value(): string {
    return this.props.value;
  }
}
```

### Repository Pattern with Unit of Work

```typescript
import {
  AbstractRelationalRepository,
  IUnitOfWork,
  RepositoryProvider
} from '@piggly/ddd-toolkit';

class UserRepository extends AbstractRelationalRepository<User> {
  async findByEmail(email: string): Promise<User | undefined> {
    // Implementation
  }
}

// Using with Unit of Work
const provider = new RepositoryProvider();
provider.register('users', UserRepository);

await provider.transaction(async (uow: IUnitOfWork) => {
  const userRepo = uow.getRepository<UserRepository>('users');
  const user = await userRepo.findById(id);
  // Operations within transaction
});
```

### Result Pattern

```typescript
import { Result } from '@piggly/ddd-toolkit';

const result = await Result.ok({ id: 1, name: 'John' })
  .map(user => ({ ...user, processed: true }))
  .chain(async user => validateUser(user))
  .tap(user => console.log('User processed:', user))
  .mapError(error => new CustomError(error));

if (result.isFailure()) {
  console.error('Error:', result.error);
} else {
  console.log('Success:', result.value());
}
```

### Domain Events

```typescript
import { DomainEvent, EventEmitter } from '@piggly/ddd-toolkit';

interface UserCreatedPayload {
  userId: string;
  email: string;
}

class UserCreatedEvent extends DomainEvent<UserCreatedPayload> {
  constructor(payload: UserCreatedPayload) {
    super('UserCreated', payload);
  }
}

// In your entity
class User extends Entity<UserProps, UUIDEntityId> {
  public static create(props: UserProps): User {
    const user = new User(props, UUIDEntityId.generate());
    user.emit(new UserCreatedEvent({
      userId: user.id.value,
      email: props.email
    }));
    return user;
  }
}
```

## Core Concepts

### Entity IDs

The library provides three types of entity IDs:

- `UUIDEntityId` - UUID v4 based identifiers;
- `StringEntityId` - String-based identifiers;
- `NumberEntityId` - Numeric identifiers.

### Collections

Specialized collection classes for managing domain objects:

- `CollectionOfEntity` - Manages entity collections;
- `CollectionOfValueObjects` - Manages value object collections;
- `CollectionOfAttributes` - Manages attribute collections.

### Service Layer

Different service types for proper separation of concerns:

- `Service` - Base service class;
- `DomainService` - Domain layer services;
- `ApplicationService` - Application layer services;
- `InfraService` - Infrastructure layer services.

### Error Handling

Comprehensive error system with domain-specific errors:

- `DomainError` - Base domain error;
- `BusinessRuleViolationError` - Business rule violations;
- `RuntimeError` - Runtime errors;
- `ApplicationError` - Application layer errors.

## Testing

This library uses Jest for testing. Run tests with:

```bash
# Run tests once
npm run test:once

# Run tests in watch mode
npm run test

# Run tests with coverage
npm run test:coverage
```

## Development

### Build Commands

```bash
# Full build
npm run build

# Type checking
npm run check

# Linting
npm run lint

# Format code
npm run format
```

### Project Structure

```text
src/
├── core/
│   ├── entities/          # Entity classes and collections
│   ├── vos/               # Value objects and collections
│   ├── repositories/      # Repository pattern implementation
│   ├── services/          # Service layer classes
│   ├── application/       # Application layer components
│   ├── errors/            # Error classes
│   └── deprecated/        # Deprecated features
├── utils/                 # Utility functions
└── index.ts              # Main exports
```

## Requirements

- Node.js >= 18
- TypeScript >= 5.0

## Migration from v4.x

Version 5.0 introduces breaking changes. Key migration points:

1. **EventEmmiter → EventEmitter**: Update event emitter imports and it cannot be used directly anymore on `Entity` and `Attribute`;
2. **Entity IDs**: Use new ID system (`StringEntityId`, `NumberEntityId`, `UUIDEntityId`);
3. **Repository Pattern**: Adopt new repository interfaces with Unit of Work;
4. **Collections**: Collections now use `Set` internally instead of `Map`.

See [CHANGELOG.md](CHANGELOG.md) for detailed migration notes.

## Changelog

See the [CHANGELOG](CHANGELOG.md) file for information about all code changes.

## Contributing

See the [CONTRIBUTING](CONTRIBUTING.md) file for information before submitting your contribution.

## Credits

- [Caique Araujo](https://github.com/caiquearaujo)
- [All contributors](../../contributors)

## License

MIT License (MIT). See [LICENSE](LICENSE).
