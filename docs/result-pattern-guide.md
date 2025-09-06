# Result Pattern Guide

## Table of Contents
- [Introduction](#introduction)
- [Core Concepts](#core-concepts)
- [Basic Usage](#basic-usage)
- [Advanced Features](#advanced-features)
- [Async Operations](#async-operations)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)
- [API Reference](#api-reference)

## Introduction

The Result pattern is a functional programming approach to error handling that makes error states explicit and type-safe. Instead of throwing exceptions, operations return a `Result<Data, Error>` object that can be either successful (containing data) or failed (containing an error).

### Benefits

- **Type Safety**: Errors are part of the type system, making them explicit and compile-time checked
- **Composability**: Chain operations without nested try-catch blocks
- **Railway-Oriented Programming**: Transform success and failure paths independently
- **No Exceptions**: Avoid unexpected runtime exceptions and stack unwinding

## Core Concepts

### Result Type

A `Result<Data, Error>` represents the outcome of an operation that can either succeed with data of type `Data` or fail with an error of type `Error`.

```typescript
import { Result, DomainError } from '@/core';

// Success case
const success: Result<number, never> = Result.ok(42);

// Failure case
class ValidationError extends DomainError {}
const failure: Result<never, ValidationError> = Result.fail(
  new ValidationError('Invalid input')
);
```

### Success and Failure States

Every Result is in one of two states:

- **Success**: Contains data accessible via `.data`
- **Failure**: Contains an error accessible via `.error`

```typescript
const result = Result.ok(100);

if (result.isSuccess) {
  console.log(result.data); // 100
}

if (result.isFailure) {
  console.log(result.error); // Would throw - this is a success
}
```

## Basic Usage

### Creating Results

#### Success Results

```typescript
// With data
const resultWithData = Result.ok({ id: 1, name: 'John' });

// Boolean true
const resultTrue = Result.okTrue();

// Void (no data)
const resultVoid = Result.okVoid();
```

#### Failure Results

```typescript
class NotFoundError extends DomainError {
  constructor(resource: string) {
    super(`${resource} not found`);
  }
}

const notFound = Result.fail(new NotFoundError('User'));
```

### Accessing Values

```typescript
const result = getUserById(123);

// Safe access with type guards
if (result.isSuccess) {
  const user = result.data; // Type: User
  console.log(`Found user: ${user.name}`);
} else {
  const error = result.error; // Type: DomainError
  console.log(`Error: ${error.message}`);
}

// Direct access (throws if wrong state)
try {
  const user = result.data; // Throws if failure
} catch (e) {
  // Handle error
}
```

### Try-Catch Wrapper

Convert exception-throwing code to Results:

```typescript
// Synchronous
const result = Result.try(
  () => JSON.parse(jsonString),
  (error) => new ParseError(String(error))
);

// Asynchronous
const asyncResult = Result.tryAsync(
  () => fetch('/api/user'),
  (error) => new NetworkError(String(error))
);
```

## Advanced Features

### Chaining Operations

Chain multiple Result-returning operations. If any fails, the chain short-circuits:

```typescript
function validateAge(user: User): Result<User, ValidationError> {
  return user.age >= 18 
    ? Result.ok(user)
    : Result.fail(new ValidationError('Must be 18+'));
}

function validateEmail(user: User): Result<User, ValidationError> {
  return user.email.includes('@')
    ? Result.ok(user)
    : Result.fail(new ValidationError('Invalid email'));
}

const result = getUserById(id)
  .chain(validateAge)
  .chain(validateEmail)
  .chain(saveUser);

// If any step fails, result contains that error
```

### Mapping Data

Transform successful data while preserving errors:

```typescript
const userNameResult = getUserById(123)
  .map(user => user.name.toUpperCase())
  .map(name => `Hello, ${name}!`);

// Success: Result<string, GetUserError>
// Failure: Original error preserved
```

### Mapping Errors

Transform error types or add context:

```typescript
const result = fetchUserFromAPI(id)
  .mapError(error => {
    if (error.status === 404) {
      return new NotFoundError('User');
    }
    return new UnknownError(error.message);
  });
```

### Side Effects with Tap

Execute side effects without changing the Result:

```typescript
const result = createUser(userData)
  .tap(user => console.log(`Created user: ${user.id}`))
  .tap(user => sendWelcomeEmail(user))
  .tap(user => analytics.track('user.created', user));

// Result is unchanged, side effects executed only on success
```

### Collecting Multiple Results

Convert an array of Results into a Result of array:

```typescript
const userResults = [
  getUserById(1),
  getUserById(2),
  getUserById(3)
];

const allUsersResult = Result.collect(userResults);
// Success: Result<User[], never> with all users
// Failure: First error encountered
```

## Async Operations

### ResultAsync

For asynchronous operations, use `ResultAsync`:

```typescript
class UserRepository {
  async findById(id: number): Promise<Result<User, NotFoundError>> {
    const user = await db.users.findOne(id);
    return user 
      ? Result.ok(user)
      : Result.fail(new NotFoundError('User'));
  }
}

// Chain async operations
const result = await getUserAsync(id)
  .chainAsync(user => enrichUserData(user))
  .map(user => user.profile)
  .tap(profile => console.log(profile))
  .toPromise();
```

### Converting Between Sync and Async

```typescript
// Result to ResultAsync
const asyncResult = Result.ok(42)
  .chainAsync(async value => {
    const doubled = await doubleAsync(value);
    return Result.ok(doubled);
  });

// Promise to ResultAsync
const resultAsync = Result.fromPromise(
  fetch('/api/data'),
  error => new NetworkError(String(error))
);

// ResultAsync to Promise
const promise = resultAsync.toPromise();
```

### Async Chaining Examples

```typescript
function fetchUser(id: number): ResultAsync<User, ApiError> {
  return Result.fromPromise(
    api.get(`/users/${id}`),
    error => new ApiError('Failed to fetch user')
  );
}

function fetchPosts(userId: number): ResultAsync<Post[], ApiError> {
  return Result.fromPromise(
    api.get(`/users/${userId}/posts`),
    error => new ApiError('Failed to fetch posts')
  );
}

const userWithPosts = fetchUser(123)
  .chainAsync(user => 
    fetchPosts(user.id)
      .map(posts => ({ ...user, posts }))
  )
  .map(userWithPosts => ({
    name: userWithPosts.name,
    postCount: userWithPosts.posts.length
  }));

const result = await userWithPosts.toPromise();
```

## Error Handling

### Custom Domain Errors

All errors must extend `DomainError`:

```typescript
import { DomainError } from '@/core';

class ValidationError extends DomainError {
  constructor(
    public readonly field: string,
    public readonly constraint: string
  ) {
    super(`Validation failed for ${field}: ${constraint}`);
  }
}

class BusinessRuleError extends DomainError {
  constructor(
    public readonly rule: string,
    public readonly context: Record<string, any>
  ) {
    super(`Business rule violation: ${rule}`);
  }
}
```

### Error Recovery

```typescript
function getConfigValue(key: string): Result<string, NotFoundError> {
  const value = config[key];
  return value 
    ? Result.ok(value)
    : Result.fail(new NotFoundError(`Config key: ${key}`));
}

// Provide default on error
const port = getConfigValue('PORT')
  .map(Number)
  .mapError(() => new ConfigError('Invalid port'))
  .chain(port => 
    port > 0 && port < 65536
      ? Result.ok(port)
      : Result.fail(new ConfigError('Port out of range'))
  );

// Use default if failed
const finalPort = port.isSuccess ? port.data : 3000;
```

## Best Practices

### 1. Make Errors Explicit

```typescript
// Good: Explicit error types
function divide(a: number, b: number): Result<number, DivisionError> {
  if (b === 0) {
    return Result.fail(new DivisionError('Division by zero'));
  }
  return Result.ok(a / b);
}

// Bad: Generic errors
function divide(a: number, b: number): Result<number, Error> {
  // Less type safety
}
```

### 2. Use Type Guards

```typescript
function processResult(result: Result<User, ValidationError>) {
  if (result.isSuccess) {
    // TypeScript knows result.data is User
    sendEmail(result.data.email);
  } else {
    // TypeScript knows result.error is ValidationError
    logValidationError(result.error.field);
  }
}
```

### 3. Compose Small Functions

```typescript
// Composable validation functions
const validateNotEmpty = (str: string): Result<string, ValidationError> =>
  str.length > 0 
    ? Result.ok(str)
    : Result.fail(new ValidationError('Cannot be empty'));

const validateEmail = (str: string): Result<string, ValidationError> =>
  str.includes('@')
    ? Result.ok(str)
    : Result.fail(new ValidationError('Invalid email'));

const validateMaxLength = (max: number) => 
  (str: string): Result<string, ValidationError> =>
    str.length <= max
      ? Result.ok(str)
      : Result.fail(new ValidationError(`Max length ${max}`));

// Compose them
const validateUserEmail = (email: string) =>
  validateNotEmpty(email)
    .chain(validateEmail)
    .chain(validateMaxLength(255));
```

### 4. Handle All Error Cases

```typescript
type UserError = NotFoundError | ValidationError | PermissionError;

function handleUserOperation(result: Result<User, UserError>) {
  if (result.isFailure) {
    const error = result.error;
    
    if (error instanceof NotFoundError) {
      return respond(404, 'User not found');
    }
    
    if (error instanceof ValidationError) {
      return respond(400, error.message);
    }
    
    if (error instanceof PermissionError) {
      return respond(403, 'Access denied');
    }
    
    // TypeScript ensures all cases handled
    const _exhaustive: never = error;
  }
  
  return respond(200, result.data);
}
```

### 5. Avoid Nested Results

```typescript
// Bad: Nested Results
function bad(): Result<Result<number, Error>, Error> {
  // Difficult to work with
}

// Good: Flat Results with chain
function good(): Result<number, Error> {
  return firstOperation()
    .chain(secondOperation);
}
```

## API Reference

### Result<Data, Error>

#### Static Methods

- `Result.ok<T>(data: T): Result<T, never>` - Create success result
- `Result.okTrue(): Result<true, never>` - Create success with true
- `Result.okVoid(): Result<void, never>` - Create success with void
- `Result.fail<E>(error: E): Result<never, E>` - Create failure result
- `Result.try<D, E>(fn, mapError?): Result<D, E>` - Wrap try-catch
- `Result.tryAsync<D, E>(fn, mapError?): ResultAsync<D, E>` - Wrap async try-catch
- `Result.fromPromise<D, E>(promise, mapError): ResultAsync<D, E>` - Convert Promise
- `Result.collect<D, E>(results[]): Result<D[], E>` - Collect multiple results

#### Instance Properties

- `isSuccess: boolean` - Check if successful
- `isFailure: boolean` - Check if failed
- `data: Data` - Get data (throws if failed)
- `error: Error` - Get error (throws if success)

#### Instance Methods

- `chain<N>(fn: Data => Result<N>): Result<N>` - Chain operations
- `chainAsync<N>(fn: Data => Promise<Result<N>>): ResultAsync<N>` - Chain async
- `map<N>(fn: Data => N): Result<N>` - Transform data
- `mapError<N>(fn: Error => N): Result<Data, N>` - Transform error
- `tap(fn: Data => void): Result` - Execute side effect

### ResultAsync<Data, Error>

#### Static Methods

- `ResultAsync.fromPromise<D, E>(promise, mapError): ResultAsync<D, E>`
- `ResultAsync.fromResult<D, E>(result): ResultAsync<D, E>`
- `ResultAsync.try<D, E>(fn, mapError?): ResultAsync<D, E>`

#### Instance Methods

- `chain<N>(fn): ResultAsync<N>` - Chain sync operation
- `chainAsync<N>(fn): ResultAsync<N>` - Chain async operation
- `map<N>(fn): ResultAsync<N>` - Transform data
- `mapError<N>(fn): ResultAsync<Data, N>` - Transform error
- `tap(fn): ResultAsync` - Execute side effect
- `toPromise(): Promise<Result<Data, Error>>` - Convert to Promise

## Examples

### Repository Pattern

```typescript
class UserRepository {
  async create(data: CreateUserDto): Promise<Result<User, ValidationError>> {
    const validation = this.validate(data);
    
    if (validation.isFailure) {
      return validation;
    }
    
    return Result.tryAsync(
      () => this.db.users.create(data),
      error => new ValidationError('Failed to create user')
    ).toPromise();
  }
  
  private validate(data: CreateUserDto): Result<void, ValidationError> {
    if (!data.email.includes('@')) {
      return Result.fail(new ValidationError('Invalid email'));
    }
    
    if (data.age < 18) {
      return Result.fail(new ValidationError('Must be 18+'));
    }
    
    return Result.okVoid();
  }
}
```

### Use Case Implementation

```typescript
class CreateOrderUseCase {
  constructor(
    private orderRepo: OrderRepository,
    private inventoryService: InventoryService,
    private paymentService: PaymentService
  ) {}
  
  async execute(input: CreateOrderInput): Promise<Result<Order, CreateOrderError>> {
    return this.validateInput(input)
      .chainAsync(() => this.checkInventory(input.items))
      .chainAsync(() => this.processPayment(input.payment))
      .chainAsync(() => this.createOrder(input))
      .tap(order => this.sendConfirmationEmail(order))
      .toPromise();
  }
  
  private validateInput(input: CreateOrderInput): Result<void, ValidationError> {
    if (input.items.length === 0) {
      return Result.fail(new ValidationError('Order must have items'));
    }
    
    if (input.totalAmount <= 0) {
      return Result.fail(new ValidationError('Invalid amount'));
    }
    
    return Result.okVoid();
  }
  
  private async checkInventory(items: OrderItem[]): Promise<Result<void, InventoryError>> {
    const available = await this.inventoryService.checkAvailability(items);
    return available
      ? Result.okVoid()
      : Result.fail(new InventoryError('Items not available'));
  }
  
  private async processPayment(payment: PaymentInfo): Promise<Result<string, PaymentError>> {
    return this.paymentService.charge(payment);
  }
  
  private async createOrder(input: CreateOrderInput): Promise<Result<Order, DatabaseError>> {
    return this.orderRepo.create(input);
  }
  
  private async sendConfirmationEmail(order: Order): Promise<void> {
    // Fire and forget
    await this.emailService.send(order.customerEmail, order);
  }
}
```

### HTTP Controller

```typescript
class UserController {
  constructor(private userService: UserService) {}
  
  async createUser(req: Request, res: Response) {
    const result = await this.userService.create(req.body);
    
    if (result.isFailure) {
      const error = result.error;
      
      if (error instanceof ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      
      if (error instanceof DuplicateError) {
        return res.status(409).json({ error: 'User already exists' });
      }
      
      return res.status(500).json({ error: 'Internal server error' });
    }
    
    return res.status(201).json(result.data);
  }
}
```

## Migration Guide

### From Exceptions to Results

```typescript
// Before: Exceptions
class UserService {
  async getUser(id: number): Promise<User> {
    const user = await db.findUser(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}

// After: Results
class UserService {
  async getUser(id: number): Promise<Result<User, NotFoundError>> {
    const user = await db.findUser(id);
    return user
      ? Result.ok(user)
      : Result.fail(new NotFoundError('User'));
  }
}
```

### From Callbacks to Results

```typescript
// Before: Callbacks
function readFile(path: string, callback: (err: Error, data: string) => void) {
  fs.readFile(path, 'utf8', callback);
}

// After: Results
function readFile(path: string): ResultAsync<string, FileError> {
  return Result.fromPromise(
    fs.promises.readFile(path, 'utf8'),
    error => new FileError(`Failed to read ${path}`)
  );
}
```

## Conclusion

The Result pattern provides a robust, type-safe approach to error handling that makes your code more predictable and maintainable. By making errors explicit in the type system and providing powerful composition methods, it enables you to write cleaner, more functional code that clearly expresses both success and failure paths.

Key takeaways:
- Always extend `DomainError` for custom errors
- Use `chain` for sequential operations
- Use `map` for data transformations
- Use `tap` for side effects
- Leverage TypeScript's type system with type guards
- Compose small, reusable functions
- Make error handling explicit and exhaustive