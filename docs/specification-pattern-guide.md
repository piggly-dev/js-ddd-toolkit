# Specification Pattern Guide

## Table of Contents
- [Introduction](#introduction)
- [Core Concepts](#core-concepts)
- [Basic Usage](#basic-usage)
- [Composite Specifications](#composite-specifications)
- [Business Rules Validation](#business-rules-validation)
- [Integration with Result Pattern](#integration-with-result-pattern)
- [Advanced Patterns](#advanced-patterns)
- [Best Practices](#best-practices)
- [API Reference](#api-reference)

## Introduction

The Specification pattern is a behavioral design pattern that encapsulates business rules into reusable, composable, and testable units. It provides a way to chain business logic using boolean logic (AND, OR, NOT) while maintaining clean separation of concerns.

### Key Benefits

- **Reusability**: Business rules can be reused across different contexts
- **Composability**: Complex rules built from simple specifications using logical operators
- **Testability**: Each specification can be tested in isolation
- **Expressiveness**: Business rules expressed in domain language
- **Separation of Concerns**: Business logic separated from implementation details
- **Explainability**: Specifications can explain why they are (not) satisfied

## Core Concepts

### What is a Specification?

A specification answers a single question: "Does this candidate satisfy a specific business rule?" It returns a boolean value and can be combined with other specifications to form complex business rules.

```typescript
import { Specification } from '@/core';

class MinimumAgeSpecification extends Specification<Person> {
  constructor(private minimumAge: number) {
    super();
  }

  isSatisfiedBy(person: Person): boolean {
    return person.age >= this.minimumAge;
  }

  explainWhy(person: Person): string {
    if (this.isSatisfiedBy(person)) {
      return `Person age (${person.age}) meets minimum age (${this.minimumAge})`;
    }
    return `Person age (${person.age}) below minimum age (${this.minimumAge})`;
  }
}
```

### The ISpecification Interface

Every specification implements the `ISpecification<Candidate>` interface:

```typescript
interface ISpecification<Candidate> {
  // Core evaluation
  isSatisfiedBy(candidate: Candidate): boolean;
  
  // Explanation for debugging/logging
  explainWhy(candidate: Candidate): string;
  
  // Integration with Result pattern
  check(candidate: Candidate, message?: string): Result<void, DomainError>;
  
  // Composition methods
  and(other: ISpecification<Candidate>): ISpecification<Candidate>;
  or(other: ISpecification<Candidate>): ISpecification<Candidate>;
  not(): ISpecification<Candidate>;
}
```

## Basic Usage

### Creating Simple Specifications

```typescript
import { Specification } from '@/core';

// Age specification
class AdultSpecification extends Specification<Person> {
  isSatisfiedBy(person: Person): boolean {
    return person.age >= 18;
  }

  explainWhy(person: Person): string {
    return this.isSatisfiedBy(person)
      ? 'Person is an adult'
      : `Person is underage (${person.age} years old)`;
  }
}

// Email specification
class ValidEmailSpecification extends Specification<User> {
  private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  isSatisfiedBy(user: User): boolean {
    return this.emailRegex.test(user.email);
  }

  explainWhy(user: User): string {
    return this.isSatisfiedBy(user)
      ? 'Email format is valid'
      : `Invalid email format: ${user.email}`;
  }
}

// Premium member specification
class PremiumMemberSpecification extends Specification<Customer> {
  isSatisfiedBy(customer: Customer): boolean {
    return customer.membershipLevel === 'PREMIUM';
  }

  explainWhy(customer: Customer): string {
    return this.isSatisfiedBy(customer)
      ? 'Customer is a premium member'
      : `Customer membership level is ${customer.membershipLevel}`;
  }
}
```

### Using Specifications

```typescript
const isAdult = new AdultSpecification();
const person = { name: 'John', age: 25 };

// Simple check
if (isAdult.isSatisfiedBy(person)) {
  console.log('Person can purchase alcohol');
}

// Get explanation
console.log(isAdult.explainWhy(person));
// Output: "Person is an adult"

// Integration with Result pattern
const result = isAdult.check(person, 'Must be 18 or older');
if (result.isSuccess) {
  // Proceed with adult-only operation
}
```

### Parameterized Specifications

```typescript
class MinimumBalanceSpecification extends Specification<Account> {
  constructor(private minimumBalance: number) {
    super();
  }

  isSatisfiedBy(account: Account): boolean {
    return account.balance >= this.minimumBalance;
  }

  explainWhy(account: Account): string {
    const difference = this.minimumBalance - account.balance;
    return this.isSatisfiedBy(account)
      ? `Balance sufficient (${account.balance})`
      : `Balance insufficient, need ${difference} more`;
  }
}

// Usage with different thresholds
const canWithdraw = new MinimumBalanceSpecification(100);
const isPremium = new MinimumBalanceSpecification(10000);
```

## Composite Specifications

### AND Composition

Combine specifications where all must be satisfied:

```typescript
const canPurchaseAlcohol = new AdultSpecification()
  .and(new ValidIDSpecification())
  .and(new NotIntoxicatedSpecification());

const customer = { age: 21, hasValidID: true, intoxicationLevel: 0 };

if (canPurchaseAlcohol.isSatisfiedBy(customer)) {
  // Allow purchase
}

console.log(canPurchaseAlcohol.explainWhy(customer));
// Output: "(Person is an adult) AND (Has valid ID) AND (Not intoxicated) SATISFIED"
```

### OR Composition

Combine specifications where at least one must be satisfied:

```typescript
const eligibleForDiscount = new StudentSpecification()
  .or(new SeniorCitizenSpecification())
  .or(new MilitarySpecification());

const customer = { age: 65, isStudent: false, isMilitary: false };

if (eligibleForDiscount.isSatisfiedBy(customer)) {
  // Apply discount
}
```

### NOT Composition

Negate a specification:

```typescript
const notBanned = new BannedUserSpecification().not();
const canAccessPlatform = new ActiveAccountSpecification()
  .and(notBanned);

if (canAccessPlatform.isSatisfiedBy(user)) {
  // Allow access
}
```

### Complex Compositions

Build sophisticated business rules:

```typescript
// Loan approval specification
const creditScoreSpec = new MinimumCreditScoreSpecification(650);
const incomeSpec = new MinimumIncomeSpecification(50000);
const debtRatioSpec = new MaxDebtToIncomeRatioSpecification(0.4);
const employmentSpec = new StableEmploymentSpecification();

// Must have good credit AND (high income OR low debt ratio) AND stable job
const loanApprovalSpec = creditScoreSpec
  .and(incomeSpec.or(debtRatioSpec))
  .and(employmentSpec);

const applicant = {
  creditScore: 720,
  income: 45000,
  debtRatio: 0.3,
  employmentMonths: 24
};

const result = loanApprovalSpec.check(applicant, 'Loan application denied');
if (result.isFailure) {
  console.log(loanApprovalSpec.explainWhy(applicant));
}
```

## Business Rules Validation

### Order Validation Example

```typescript
class OrderSpecification {
  static canBePlaced(): ISpecification<Order> {
    return new HasItemsSpecification()
      .and(new ValidShippingAddressSpecification())
      .and(new PaymentMethodSpecification())
      .and(new ItemsInStockSpecification());
  }

  static canBeCancelled(): ISpecification<Order> {
    return new OrderStatusSpecification(['PENDING', 'CONFIRMED'])
      .and(new NotShippedSpecification())
      .and(new CreatedWithinSpecification(24)); // hours
  }

  static canBeRefunded(): ISpecification<Order> {
    return new OrderStatusSpecification(['DELIVERED'])
      .and(new DeliveredWithinSpecification(30)) // days
      .and(new NotRefundedSpecification());
  }
}

// Usage
const order = await orderRepository.findById(orderId);

const canCancel = OrderSpecification.canBeCancelled();
if (canCancel.isSatisfiedBy(order)) {
  await orderService.cancel(order);
} else {
  throw new Error(canCancel.explainWhy(order));
}
```

### User Access Control

```typescript
class AccessControlSpecification {
  static canAccessResource(resource: Resource): ISpecification<User> {
    const isOwner = new ResourceOwnerSpecification(resource);
    const hasPermission = new HasPermissionSpecification(resource.requiredPermission);
    const isAdmin = new RoleSpecification('ADMIN');
    
    // Owner OR (has permission AND not suspended) OR admin
    return isOwner
      .or(hasPermission.and(new NotSuspendedSpecification()))
      .or(isAdmin);
  }

  static canModifyResource(resource: Resource): ISpecification<User> {
    const isOwner = new ResourceOwnerSpecification(resource);
    const hasWritePermission = new HasPermissionSpecification('WRITE');
    const isNotReadOnly = new ResourceReadOnlySpecification().not();
    
    return (isOwner.or(hasWritePermission))
      .and(isNotReadOnly)
      .and(new NotSuspendedSpecification());
  }
}
```

## Integration with Result Pattern

### Using check() Method

The `check()` method returns a `Result<void, DomainError>`:

```typescript
class PremiumFeatureSpecification extends Specification<User> {
  isSatisfiedBy(user: User): boolean {
    return user.subscription === 'PREMIUM' || user.subscription === 'ENTERPRISE';
  }

  explainWhy(user: User): string {
    return this.isSatisfiedBy(user)
      ? 'User has premium access'
      : `User subscription (${user.subscription}) does not include premium features`;
  }
}

// In use case
class AccessPremiumFeatureUseCase {
  execute(userId: string): Result<PremiumContent, DomainError> {
    const user = this.userRepository.findById(userId);
    
    const canAccess = new PremiumFeatureSpecification();
    const accessResult = canAccess.check(
      user, 
      'Premium subscription required for this feature'
    );
    
    if (accessResult.isFailure) {
      return Result.fail(accessResult.error);
    }
    
    return Result.ok(this.premiumContent);
  }
}
```

### Chaining with Result Operations

```typescript
class ProcessOrderUseCase {
  execute(orderData: OrderData): Result<Order, DomainError> {
    return this.validateCustomer(orderData.customerId)
      .chain(() => this.validateItems(orderData.items))
      .chain(() => this.validatePayment(orderData.payment))
      .chain(() => this.createOrder(orderData));
  }

  private validateCustomer(customerId: string): Result<void, DomainError> {
    const customer = this.customerRepo.findById(customerId);
    const spec = new ActiveCustomerSpecification()
      .and(new NotBlacklistedSpecification())
      .and(new EmailVerifiedSpecification());
    
    return spec.check(customer, 'Customer validation failed');
  }

  private validateItems(items: OrderItem[]): Result<void, DomainError> {
    const spec = new MinimumOrderValueSpecification(10)
      .and(new AllItemsAvailableSpecification())
      .and(new ValidQuantitiesSpecification());
    
    return spec.check(items, 'Order items validation failed');
  }
}
```

## Advanced Patterns

### Factory Pattern for Specifications

```typescript
class SpecificationFactory {
  static createAgeSpecification(context: 'alcohol' | 'voting' | 'driving'): ISpecification<Person> {
    switch(context) {
      case 'alcohol':
        return new MinimumAgeSpecification(21);
      case 'voting':
        return new MinimumAgeSpecification(18);
      case 'driving':
        return new MinimumAgeSpecification(16);
    }
  }

  static createCreditApprovalSpecification(
    productType: 'personal' | 'mortgage' | 'auto'
  ): ISpecification<CreditApplication> {
    const baseSpec = new MinimumCreditScoreSpecification(600)
      .and(new NoRecentBankruptcySpecification());

    switch(productType) {
      case 'mortgage':
        return baseSpec
          .and(new MinimumIncomeSpecification(75000))
          .and(new MaxDebtToIncomeSpecification(0.43));
      case 'auto':
        return baseSpec
          .and(new MinimumIncomeSpecification(30000));
      case 'personal':
        return baseSpec
          .and(new MinimumIncomeSpecification(25000));
    }
  }
}
```

### Dynamic Specification Building

```typescript
class DynamicSpecificationBuilder<T> {
  private specifications: ISpecification<T>[] = [];
  private operator: 'AND' | 'OR' = 'AND';

  and(spec: ISpecification<T>): this {
    this.specifications.push(spec);
    this.operator = 'AND';
    return this;
  }

  or(spec: ISpecification<T>): this {
    if (this.specifications.length > 0 && this.operator === 'AND') {
      throw new Error('Cannot mix AND and OR without grouping');
    }
    this.specifications.push(spec);
    this.operator = 'OR';
    return this;
  }

  build(): ISpecification<T> {
    if (this.specifications.length === 0) {
      return new AlwaysTrueSpecification<T>();
    }

    return this.specifications.reduce((acc, spec) => {
      if (!acc) return spec;
      return this.operator === 'AND' ? acc.and(spec) : acc.or(spec);
    });
  }
}

// Usage
const builder = new DynamicSpecificationBuilder<User>();
if (requireEmailVerification) {
  builder.and(new EmailVerifiedSpecification());
}
if (requirePhoneVerification) {
  builder.and(new PhoneVerifiedSpecification());
}
const spec = builder.build();
```

### Specification with Context

```typescript
abstract class ContextualSpecification<T, Context> extends Specification<T> {
  constructor(protected context: Context) {
    super();
  }
}

class RegionalPricingSpecification extends ContextualSpecification<Product, Region> {
  isSatisfiedBy(product: Product): boolean {
    const regionalPrice = product.prices[this.context.code];
    return regionalPrice !== undefined && regionalPrice > 0;
  }

  explainWhy(product: Product): string {
    return this.isSatisfiedBy(product)
      ? `Product has pricing for region ${this.context.name}`
      : `Product lacks pricing for region ${this.context.name}`;
  }
}

// Usage
const region = { code: 'US', name: 'United States' };
const spec = new RegionalPricingSpecification(region);
```

### Async Specifications

For specifications that require async operations:

```typescript
abstract class AsyncSpecification<T> {
  abstract isSatisfiedByAsync(candidate: T): Promise<boolean>;
  abstract explainWhyAsync(candidate: T): Promise<string>;

  async checkAsync(candidate: T, message?: string): Promise<Result<void, DomainError>> {
    const satisfied = await this.isSatisfiedByAsync(candidate);
    if (satisfied) {
      return Result.okVoid();
    }
    return Result.fail(
      new BusinessRuleViolationError(
        'AsyncSpecificationNotSatisfied',
        message ?? await this.explainWhyAsync(candidate)
      )
    );
  }
}

class UniqueEmailSpecification extends AsyncSpecification<User> {
  constructor(private userRepository: UserRepository) {
    super();
  }

  async isSatisfiedByAsync(user: User): Promise<boolean> {
    const existing = await this.userRepository.findByEmail(user.email);
    return existing === null || existing.id === user.id;
  }

  async explainWhyAsync(user: User): Promise<string> {
    const satisfied = await this.isSatisfiedByAsync(user);
    return satisfied
      ? 'Email is unique'
      : `Email ${user.email} is already in use`;
  }
}
```

## Best Practices

### 1. Single Responsibility

Each specification should check one business rule:

```typescript
// Good: Single responsibility
class MinimumAgeSpecification extends Specification<Person> {
  constructor(private minAge: number) { super(); }
  
  isSatisfiedBy(person: Person): boolean {
    return person.age >= this.minAge;
  }
}

// Bad: Multiple responsibilities
class PersonValidationSpecification extends Specification<Person> {
  isSatisfiedBy(person: Person): boolean {
    return person.age >= 18 && 
           person.email.includes('@') && 
           person.name.length > 0;
  }
}
```

### 2. Meaningful Names

Use domain language in specification names:

```typescript
// Good: Domain-specific names
class CustomerHasOutstandingInvoicesSpecification { }
class ProductIsInSeasonSpecification { }
class OrderExceedsCreditLimitSpecification { }

// Bad: Generic names
class ValidSpecification { }
class CheckSpecification { }
class Specification1 { }
```

### 3. Immutability

Specifications should be immutable:

```typescript
// Good: Immutable
class ThresholdSpecification extends Specification<Measurement> {
  constructor(private readonly threshold: number) {
    super();
  }

  isSatisfiedBy(measurement: Measurement): boolean {
    return measurement.value > this.threshold;
  }
}

// Bad: Mutable
class ThresholdSpecification extends Specification<Measurement> {
  public threshold: number; // Mutable!
  
  setThreshold(value: number) {
    this.threshold = value;
  }
}
```

### 4. Testability

Write unit tests for each specification:

```typescript
describe('MinimumAgeSpecification', () => {
  const spec = new MinimumAgeSpecification(18);

  it('should satisfy when age is exactly minimum', () => {
    expect(spec.isSatisfiedBy({ age: 18 })).toBe(true);
  });

  it('should satisfy when age is above minimum', () => {
    expect(spec.isSatisfiedBy({ age: 25 })).toBe(true);
  });

  it('should not satisfy when age is below minimum', () => {
    expect(spec.isSatisfiedBy({ age: 17 })).toBe(false);
  });

  it('should explain why not satisfied', () => {
    const explanation = spec.explainWhy({ age: 17 });
    expect(explanation).toContain('below minimum age');
  });
});
```

### 5. Composition Over Inheritance

Prefer composition for complex specifications:

```typescript
// Good: Composition
class PremiumCustomerSpecification extends Specification<Customer> {
  private specs = new MinimumPurchaseAmountSpecification(1000)
    .and(new AccountAgeSpecification(365))
    .and(new NoRecentComplaintsSpecification());

  isSatisfiedBy(customer: Customer): boolean {
    return this.specs.isSatisfiedBy(customer);
  }

  explainWhy(customer: Customer): string {
    return this.specs.explainWhy(customer);
  }
}
```

### 6. Performance Considerations

Order specifications by cost and likelihood:

```typescript
// Check cheap/likely-to-fail specs first
const canProcess = new QuickValidationSpecification()     // Fast check
  .and(new DatabaseLookupSpecification())                // Medium cost
  .and(new ExternalAPIValidationSpecification());        // Expensive

// Use short-circuit evaluation
class OptimizedAndSpecification<T> extends Specification<T> {
  constructor(
    private specs: ISpecification<T>[]
  ) { super(); }

  isSatisfiedBy(candidate: T): boolean {
    // Sort by estimated cost (cached)
    const sorted = this.specs.sort((a, b) => a.cost - b.cost);
    
    for (const spec of sorted) {
      if (!spec.isSatisfiedBy(candidate)) {
        return false; // Short-circuit
      }
    }
    return true;
  }
}
```

## API Reference

### Specification Abstract Class

```typescript
abstract class Specification<Candidate> implements ISpecification<Candidate> {
  // Core methods (must implement)
  abstract isSatisfiedBy(candidate: Candidate): boolean;
  abstract explainWhy(candidate: Candidate): string;
  
  // Provided methods
  check(candidate: Candidate, message?: string): Result<void, DomainError>;
  and(other: ISpecification<Candidate>): ISpecification<Candidate>;
  or(other: ISpecification<Candidate>): ISpecification<Candidate>;
  not(): ISpecification<Candidate>;
}
```

### Built-in Specifications

#### AlwaysTrueSpecification

Always returns true:

```typescript
const spec = new AlwaysTrueSpecification<User>();
spec.isSatisfiedBy(anyUser); // Always true
```

#### AlwaysFalseSpecification

Always returns false:

```typescript
const spec = new AlwaysFalseSpecification<User>();
spec.isSatisfiedBy(anyUser); // Always false
```

#### AndSpecification

Combines two specifications with AND logic:

```typescript
const combined = new AndSpecification(spec1, spec2);
// True only if both spec1 AND spec2 are satisfied
```

#### OrSpecification

Combines two specifications with OR logic:

```typescript
const combined = new OrSpecification(spec1, spec2);
// True if either spec1 OR spec2 is satisfied
```

#### NotSpecification

Negates a specification:

```typescript
const negated = new NotSpecification(spec);
// True if spec is NOT satisfied
```

## Real-World Examples

### E-Commerce Discount Rules

```typescript
class DiscountEligibilityService {
  private blackFridaySpec = new DateRangeSpecification(
    new Date('2024-11-29'),
    new Date('2024-11-30')
  );

  private vipCustomerSpec = new CustomerTierSpecification('VIP')
    .or(new TotalPurchasesSpecification(10000));

  private bulkOrderSpec = new MinimumQuantitySpecification(10);

  calculateDiscount(order: Order, customer: Customer): number {
    let discount = 0;

    // Black Friday: 20% off
    if (this.blackFridaySpec.isSatisfiedBy(order.date)) {
      discount += 0.20;
    }

    // VIP customers: 15% off
    if (this.vipCustomerSpec.isSatisfiedBy(customer)) {
      discount += 0.15;
    }

    // Bulk orders: 10% off
    if (this.bulkOrderSpec.isSatisfiedBy(order)) {
      discount += 0.10;
    }

    return Math.min(discount, 0.40); // Max 40% discount
  }
}
```

### Subscription Tier Validation

```typescript
class SubscriptionService {
  private tierSpecs = {
    basic: new AlwaysTrueSpecification<User>(),
    
    pro: new EmailVerifiedSpecification()
      .and(new AccountAgeSpecification(30)),
    
    enterprise: new EmailVerifiedSpecification()
      .and(new PhoneVerifiedSpecification())
      .and(new CompanyVerifiedSpecification())
      .and(new MinimumUsersSpecification(5))
  };

  canUpgradeToTier(user: User, tier: 'basic' | 'pro' | 'enterprise'): Result<void, DomainError> {
    const spec = this.tierSpecs[tier];
    return spec.check(user, `Cannot upgrade to ${tier} tier`);
  }
}
```

### Fraud Detection

```typescript
class FraudDetectionService {
  private suspiciousActivitySpec = new HighRiskCountrySpecification()
    .or(new UnusualPurchaseAmountSpecification())
    .or(new MultipleFailedAttemptsSpecification())
    .or(new NewAccountHighValueSpecification());

  private definitelyFraudSpec = new BlacklistedCardSpecification()
    .or(new KnownFraudulentIPSpecification());

  assessTransaction(transaction: Transaction): FraudAssessment {
    if (this.definitelyFraudSpec.isSatisfiedBy(transaction)) {
      return {
        risk: 'HIGH',
        action: 'BLOCK',
        reason: this.definitelyFraudSpec.explainWhy(transaction)
      };
    }

    if (this.suspiciousActivitySpec.isSatisfiedBy(transaction)) {
      return {
        risk: 'MEDIUM',
        action: 'REVIEW',
        reason: this.suspiciousActivitySpec.explainWhy(transaction)
      };
    }

    return {
      risk: 'LOW',
      action: 'APPROVE',
      reason: 'Transaction appears legitimate'
    };
  }
}
```

## Conclusion

The Specification pattern provides a powerful way to encapsulate business rules in a reusable, testable, and composable manner. By combining specifications using logical operators, you can build complex business rules from simple, focused components.

Key takeaways:
- Encapsulate each business rule in its own specification
- Use composition to build complex rules from simple ones
- Leverage the `explainWhy` method for debugging and user feedback
- Integrate with the Result pattern for type-safe error handling
- Keep specifications immutable and focused on a single responsibility
- Test each specification independently
- Use domain language in specification names