# Result Pattern Guide

The `Result` class is a core component of this DDD toolkit that implements the Railway-Oriented Programming pattern. It provides a type-safe way to handle operations that can either succeed with data or fail with an error, eliminating the need for exception handling in most cases.

## Table of Contents

- [Basic Concepts](#basic-concepts)
- [Creating Results](#creating-results)
- [Accessing Data and Errors](#accessing-data-and-errors)
- [Chaining Operations](#chaining-operations)
- [Transformation Methods](#transformation-methods)
- [Error Handling](#error-handling)
- [Advanced Patterns](#advanced-patterns)
- [Best Practices](#best-practices)
- [Real-World Examples](#real-world-examples)

## Basic Concepts

The `Result<Data, Error>` type represents an operation that can either:

- **Succeed** with data of type `Data`
- **Fail** with an error of type `Error` (must extend `DomainError`)

This eliminates the need for try-catch blocks and makes error handling explicit and type-safe.

```typescript
import { Result, DomainError } from '@piggly/ddd-toolkit';

// A successful result
const success = Result.ok("Hello World");

// A failed result
const failure = Result.fail(new DomainError("Something went wrong", "ERROR_CODE"));
```

## Creating Results

### Success Results

```typescript
// Simple data
const numberResult = Result.ok(42);
const stringResult = Result.ok("Hello");
const objectResult = Result.ok({ id: 1, name: "John" });

// Complex objects
const userResult = Result.ok({
  id: 123,
  email: "john@example.com",
  profile: { firstName: "John", lastName: "Doe" }
});
```

### Failure Results

```typescript
import { DomainError, ApplicationError, RuntimeError } from '@piggly/ddd-toolkit';

// Basic domain error
const domainError = Result.fail(
  new DomainError("User not found", "USER_NOT_FOUND")
);

// Application layer error
const appError = Result.fail(
  new ApplicationError("Service unavailable", "SERVICE_ERROR")
);

// Runtime error with context
const runtimeError = Result.fail(
  new RuntimeError("Database connection failed", "DB_CONNECTION_ERROR")
);
```

## Accessing Data and Errors

### Checking Result Status

```typescript
const result = Result.ok("success");

if (result.isSuccess) {
  console.log("Operation succeeded");
  const data = result.data; // Type-safe access
}

if (result.isFailure) {
  console.log("Operation failed");
  const error = result.error; // Type-safe access
}
```

### Safe Data Access

```typescript
// This will throw if result is a failure
try {
  const data = result.data;
} catch (error) {
  console.log("Cannot access data of failed result");
}

// This will throw if result is a success
try {
  const error = result.error;
} catch (error) {
  console.log("Cannot access error of successful result");
}
```

## Chaining Operations

The `chain()` method allows you to compose operations that return Results, creating a pipeline where failures automatically propagate.

### Basic Chaining

```typescript
async function processUser(userId: string): Promise<Result<UserProfile, DomainError>> {
  const userResult = await fetchUser(userId);

  return userResult.chain(async (user) => {
    return await validateUser(user);
  }).chain(async (validUser) => {
    return await enrichUserProfile(validUser);
  });
}
```

### Synchronous and Asynchronous Functions

```typescript
const result = Result.ok(10)
  .chain(value => Result.ok(value * 2))        // Sync function
  .chain(async value => {                      // Async function
    const processed = await processAsync(value);
    return Result.ok(processed);
  });
```

### Error Propagation

```typescript
const pipeline = Result.ok("input")
  .chain(data => Result.ok(data.toUpperCase()))
  .chain(data => Result.fail(new DomainError("Failed here", "ERROR")))
  .chain(data => Result.ok("This won't execute")); // Skipped due to previous failure

// pipeline will contain the failure from step 2
```

## Transformation Methods

### `map()` - Transform Success Data

Use `map()` when you want to transform the data inside a successful Result without needing to return another Result.

```typescript
// Transform user data for API response
const userResult = Result.ok({
  id: 123,
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com"
});

const apiResponse = userResult.map(user => ({
  id: user.id,
  fullName: `${user.firstName} ${user.lastName}`,
  displayName: user.firstName,
  contact: user.email
}));

// Calculate derived values
const orderResult = Result.ok({
  items: [{ price: 10 }, { price: 20 }, { price: 30 }],
  taxRate: 0.1
});

const orderSummary = orderResult.map(order => {
  const subtotal = order.items.reduce((sum, item) => sum + item.price, 0);
  return {
    subtotal,
    tax: subtotal * order.taxRate,
    total: subtotal * (1 + order.taxRate),
    itemCount: order.items.length
  };
});

// Format dates
const timestampResult = Result.ok(new Date());
const formattedDate = timestampResult.map(date => ({
  iso: date.toISOString(),
  display: date.toLocaleDateString(),
  timestamp: date.getTime()
}));
```

### `tap()` - Side Effects Without Modification

Use `tap()` for side effects like logging, metrics, notifications, or debugging without changing the Result.

```typescript
// Logging and monitoring
const processResult = Result.ok({ userId: 123, action: "login" })
  .tap(data => console.log(`Processing: ${data.action} for user ${data.userId}`))
  .tap(data => logger.info('User action logged', data))
  .tap(data => metrics.increment('user.action', { action: data.action }))
  .tap(data => auditService.log(data));

// Debugging in complex chains
const calculation = Result.ok(100)
  .map(value => value * 2)
  .tap(value => console.log(`After doubling: ${value}`))
  .map(value => value + 50)
  .tap(value => console.log(`After adding 50: ${value}`))
  .map(value => value / 3)
  .tap(value => console.log(`Final result: ${value}`));

// Triggering notifications
const orderResult = Result.ok({
  orderId: 'ORD-123',
  customerId: 'CUST-456',
  total: 99.99
})
  .tap(order => emailService.sendOrderConfirmation(order.customerId, order))
  .tap(order => smsService.sendOrderUpdate(order.customerId))
  .tap(order => analyticsService.trackPurchase(order))
  .tap(order => cache.invalidate(`cart:${order.customerId}`));

// Caching successful operations
const expensiveOperation = await performCalculation(input)
  .tap(result => cache.set(`calc:${input}`, result, 3600))
  .tap(result => logger.debug('Calculation cached', { input, result }));
```

### `mapError()` - Transform Errors

Use `mapError()` to convert error types, add context, or transform errors for different architectural layers.

```typescript
// Converting between error types
class DatabaseError extends DomainError {
  constructor(message: string, public query: string) {
    super(message, 'DATABASE_ERROR');
  }
}

class UserNotFoundError extends DomainError {
  constructor(userId: string) {
    super(`User with ID ${userId} not found`, 'USER_NOT_FOUND');
    this.userId = userId;
  }
}

const dbResult: Result<User, DatabaseError> = Result.fail(
  new DatabaseError('Connection timeout', 'SELECT * FROM users WHERE id = ?')
);

const userResult = dbResult.mapError(dbError =>
  new UserNotFoundError('unknown')
);

// Adding context to errors
const validationResult = Result.fail(
  new DomainError('Invalid email format', 'VALIDATION_ERROR')
);

const contextualError = validationResult.mapError(error =>
  new DomainError(
    `User registration failed: ${error.message}`,
    'USER_REGISTRATION_ERROR'
  )
);

// Layer-specific error transformation
const domainResult: Result<Order, DomainError> = Result.fail(
  new DomainError('Insufficient inventory', 'INVENTORY_ERROR')
);

// Transform for application layer
const appResult = domainResult.mapError(domainError =>
  new ApplicationError(
    'Order processing failed',
    'ORDER_PROCESSING_ERROR'
  )
);

// Transform for API layer
const apiResult = appResult.mapError(appError =>
  new RuntimeError(
    'Service temporarily unavailable',
    'SERVICE_ERROR'
  )
);
```

## Error Handling

### Error Hierarchy

This toolkit provides a structured error hierarchy:

```typescript
// Base domain error
class CustomDomainError extends DomainError {
  constructor(message: string, code: string, public context?: any) {
    super(message, code);
    this.context = context;
  }
}

// Business rule violations
class InsufficientFundsError extends BusinessRuleViolationError {
  constructor(required: number, available: number) {
    super(`Insufficient funds: required ${required}, available ${available}`);
    this.required = required;
    this.available = available;
  }
}

// Validation errors
class InvalidEmailError extends InvalidPayloadError {
  constructor(email: string) {
    super(`Invalid email format: ${email}`);
    this.email = email;
  }
}
```

### Error Recovery Patterns

```typescript
// Fallback on error
async function getUserWithFallback(userId: string): Promise<Result<User, DomainError>> {
  const primaryResult = await fetchUserFromPrimary(userId);

  if (primaryResult.isFailure) {
    console.log('Primary fetch failed, trying cache...');
    return await fetchUserFromCache(userId);
  }

  return primaryResult;
}

// Error aggregation
function validateUserData(data: any): Result<ValidatedUser, DomainError> {
  const errors: string[] = [];

  if (!data.email) errors.push('Email is required');
  if (!data.name) errors.push('Name is required');
  if (data.age < 0) errors.push('Age must be positive');

  if (errors.length > 0) {
    return Result.fail(
      new DomainError(`Validation failed: ${errors.join(', ')}`, 'VALIDATION_ERROR')
    );
  }

  return Result.ok({
    email: data.email,
    name: data.name,
    age: data.age
  });
}
```

## Advanced Patterns

### Conditional Processing

```typescript
async function processUserConditionally(
  user: User,
  shouldEnrich: boolean
): Promise<Result<ProcessedUser, DomainError>> {
  let result = Result.ok(user);

  if (shouldEnrich) {
    result = await result.chain(async (u) => await enrichUserData(u));
  }

  return result
    .map(u => ({ ...u, processed: true, timestamp: Date.now() }))
    .tap(u => logger.info('User processed', { userId: u.id, enriched: shouldEnrich }));
}
```

### Result Collections

```typescript
// Process multiple results
async function processUsers(userIds: string[]): Promise<Result<ProcessedUser[], DomainError>> {
  const results = await Promise.all(
    userIds.map(id => processUser(id))
  );

  // Check if any failed
  const failures = results.filter(r => r.isFailure);
  if (failures.length > 0) {
    return Result.fail(
      new DomainError(`Failed to process ${failures.length} users`, 'BATCH_PROCESSING_ERROR')
    );
  }

  // Extract all successful data
  const processedUsers = results.map(r => r.data);
  return Result.ok(processedUsers);
}
```

### Combining with Other Patterns

```typescript
// Result with Repository pattern
class UserRepository {
  async findById(id: string): Promise<Result<User, DomainError>> {
    try {
      const user = await this.db.findOne({ id });
      if (!user) {
        return Result.fail(new DomainError(`User ${id} not found`, 'USER_NOT_FOUND'));
      }
      return Result.ok(user);
    } catch (error) {
      return Result.fail(new DomainError('Database error', 'DB_ERROR'));
    }
  }
}

// Result with Use Case pattern
class RegisterUserUseCase {
  async execute(userData: UserRegistrationData): Promise<Result<User, DomainError>> {
    return this.validateUserData(userData)
      .chain(async (validData) => await this.checkEmailUniqueness(validData))
      .chain(async (checkedData) => await this.createUser(checkedData))
      .tap(user => this.sendWelcomeEmail(user))
      .mapError(error => new ApplicationError('Registration failed', 'REGISTRATION_ERROR'));
  }
}
```

## Best Practices

### 1. Use Specific Error Types

```typescript
// Good: Specific error types
class UserNotFoundError extends DomainError {
  constructor(userId: string) {
    super(`User with ID ${userId} not found`, 'USER_NOT_FOUND');
  }
}

// Avoid: Generic errors
Result.fail(new Error('User not found')); // Don't do this
```

### 2. Keep Transformations Pure

```typescript
// Good: Pure transformation
userResult.map(user => ({
  id: user.id,
  displayName: user.firstName
}));

// Avoid: Side effects in map
userResult.map(user => {
  console.log('Processing user'); // Side effect - use tap() instead
  return { id: user.id, displayName: user.firstName };
});
```

### 3. Use Appropriate Methods

```typescript
// Good: Use tap() for side effects
result
  .tap(data => logger.info('Processing', data))
  .map(data => transform(data));

// Good: Use chain() for operations that return Results
result.chain(data => validateData(data));

// Good: Use mapError() for error transformation
result.mapError(error => new ApplicationError('Failed', 'APP_ERROR'));
```

### 4. Fail Fast and Early

```typescript
function processOrder(orderData: any): Result<Order, DomainError> {
  // Validate early
  if (!orderData) {
    return Result.fail(new DomainError('Order data is required', 'INVALID_INPUT'));
  }

  if (!orderData.customerId) {
    return Result.fail(new DomainError('Customer ID is required', 'INVALID_INPUT'));
  }

  // Continue processing...
  return Result.ok(new Order(orderData));
}
```

## Real-World Examples

### Complete User Registration Flow

```typescript
class UserRegistrationService {
  async registerUser(userData: UserRegistrationData): Promise<Result<UserProfile, DomainError>> {
    return this.validateUserInput(userData)
      .tap(data => logger.info('User data validated', { email: data.email }))
      .mapError(error => new DomainError(`Validation failed: ${error.message}`, 'VALIDATION_ERROR'))
      .chain(async (validData) => await this.checkEmailUniqueness(validData))
      .tap(data => logger.debug('Email uniqueness verified'))
      .chain(async (checkedData) => await this.hashPassword(checkedData))
      .chain(async (hashedData) => await this.createUserInDatabase(hashedData))
      .tap(user => logger.info('User created in database', { userId: user.id }))
      .mapError(error => new DomainError(`Database operation failed: ${error.message}`, 'DB_ERROR'))
      .map(user => this.createUserProfile(user))
      .tap(profile => this.scheduleWelcomeEmail(profile.email))
      .tap(profile => this.trackUserRegistration(profile.id))
      .mapError(error => new ApplicationError('User registration failed', 'REGISTRATION_ERROR'));
  }

  private validateUserInput(data: any): Result<ValidatedUserData, DomainError> {
    // Validation logic
  }

  private async checkEmailUniqueness(data: ValidatedUserData): Promise<Result<ValidatedUserData, DomainError>> {
    // Email uniqueness check
  }

  // ... other methods
}
```

### E-commerce Order Processing

```typescript
class OrderProcessor {
  async processOrder(orderData: CreateOrderData): Promise<Result<ProcessedOrder, DomainError>> {
    return this.validateOrderData(orderData)
      .tap(data => this.logOrderStart(data))
      .chain(async (validData) => await this.checkInventory(validData))
      .tap(checkedData => this.reserveInventory(checkedData))
      .chain(async (reservedData) => await this.calculatePricing(reservedData))
      .map(pricedData => this.applyDiscounts(pricedData))
      .chain(async (discountedData) => await this.processPayment(discountedData))
      .tap(paidData => this.updateInventory(paidData))
      .chain(async (finalData) => await this.createOrder(finalData))
      .map(order => this.enrichOrderData(order))
      .tap(order => this.sendOrderConfirmation(order))
      .tap(order => this.scheduleFullfillment(order))
      .mapError(error => {
        this.handleOrderFailure(error);
        return new ApplicationError('Order processing failed', 'ORDER_ERROR');
      });
  }
}
```

### API Response Handling

```typescript
class UserController {
  async getUser(req: Request, res: Response): Promise<void> {
    const userId = req.params.id;

    const result = await this.userService.getUserById(userId)
      .tap(user => logger.info('User retrieved', { userId: user.id }))
      .map(user => this.formatUserForAPI(user))
      .mapError(error => {
        logger.error('Failed to get user', { userId, error: error.message });
        return this.mapDomainErrorToHTTP(error);
      });

    if (result.isSuccess) {
      res.status(200).json({
        success: true,
        data: result.data
      });
    } else {
      const httpError = result.error;
      res.status(httpError.statusCode).json({
        success: false,
        error: {
          code: httpError.code,
          message: httpError.message
        }
      });
    }
  }

  private mapDomainErrorToHTTP(error: DomainError): HTTPError {
    switch (error.code) {
      case 'USER_NOT_FOUND':
        return new HTTPError(404, 'User not found', 'NOT_FOUND');
      case 'VALIDATION_ERROR':
        return new HTTPError(400, 'Invalid request', 'BAD_REQUEST');
      default:
        return new HTTPError(500, 'Internal server error', 'INTERNAL_ERROR');
    }
  }
}
```

The Result pattern provides a robust, type-safe foundation for error handling in Domain-Driven Design applications, making your code more predictable, testable, and maintainable.
