import { DomainError, Result } from '@/index';

class DefaultDomainError extends DomainError {
	constructor() {
		super('DefaultDomainError', 1, 'Error', 500);
	}
}

class ProcessingError extends DomainError {
	constructor(message: string) {
		super('ProcessingError', 2, message, 400);
	}
}

class TestApplicationError extends DomainError {
	constructor(message: string, code: number) {
		super('TestApplicationError', code, message, 500);
	}
}

class ValidationError extends DomainError {
	constructor(message: string) {
		super('ValidationError', 3, message, 400);
	}
}

describe('Result', () => {
	it('should create a successful result', () => {
		const result = Result.ok('data');
		expect(result.isSuccess).toBe(true);
		expect(result.isFailure).toBe(false);
		expect(result.data).toBe('data');
		expect(() => result.error).toThrow(
			'Cannot retrieve error of successful result.',
		);
	});

	it('should create a failed result', () => {
		const result = Result.fail(new DefaultDomainError());
		expect(result.isSuccess).toBe(false);
		expect(result.isFailure).toBe(true);
		expect(result.error).toBeInstanceOf(DefaultDomainError);
		expect(() => result.data).toThrow('Cannot retrieve data of failed result.');
	});

	describe('chain/chainAsync method', () => {
		it('should chain successfully with sync function', async () => {
			const result = Result.ok(10);

			const chainAsynced = result.chain(value => {
				return Result.ok(value * 2);
			});

			expect(chainAsynced.isSuccess).toBe(true);
			expect(chainAsynced.data).toBe(20);
		});

		it('should chainAsync successfully with async function', async () => {
			const result = Result.ok(5);

			const chainAsynced = await result
				.chainAsync(async value => {
					await new Promise(resolve => setTimeout(resolve, 1));
					return Result.ok(value * 3);
				})
				.toPromise();

			expect(chainAsynced.isSuccess).toBe(true);
			expect(chainAsynced.data).toBe(15);
		});

		it('should propagate error without executing function', async () => {
			const error = new ValidationError('Initial error');
			const result = Result.fail(error);

			const mockFn = jest.fn();
			const chainAsynced = result.chain(value => {
				mockFn();
				return Result.ok(value);
			});

			expect(mockFn).not.toHaveBeenCalled();
			expect(chainAsynced.isFailure).toBe(true);
			expect(chainAsynced.error).toBe(error);
		});

		it('should handle error from chainAsynced function', async () => {
			const result = Result.ok(10);
			const chainAsyncError = new ProcessingError('Chain failed');

			const chainAsynced = result.chain(_value => {
				return Result.fail(chainAsyncError);
			});

			expect(chainAsynced.isFailure).toBe(true);
			expect(chainAsynced.error).toBe(chainAsyncError);
		});
	});

	describe('map method', () => {
		it('should transform successful data', () => {
			const result = Result.ok(10);

			const mapped = result.map(value => value * 2);

			expect(mapped.isSuccess).toBe(true);
			expect(mapped.data).toBe(20);
		});

		it('should transform complex data structures', () => {
			const user = { id: 1, firstName: 'John', lastName: 'Doe' };
			const result = Result.ok(user);

			const mapped = result.map(user => ({
				id: user.id,
				displayName: user.firstName,
				fullName: `${user.firstName} ${user.lastName}`,
			}));

			expect(mapped.isSuccess).toBe(true);
			expect(mapped.data).toEqual({
				id: 1,
				displayName: 'John',
				fullName: 'John Doe',
			});
		});

		it('should propagate error without executing transformation', () => {
			const error = new ValidationError('Map error');
			const result = Result.fail(error);

			const mockFn = jest.fn();
			const mapped = result.map(value => {
				mockFn();
				return value * 2;
			});

			expect(mockFn).not.toHaveBeenCalled();
			expect(mapped.isFailure).toBe(true);
			expect(mapped.error).toBe(error);
		});
	});

	describe('tap method', () => {
		it('should execute side effect on success without changing result', () => {
			const result = Result.ok(42);
			const mockFn = jest.fn();

			const tapped = result.tap(value => {
				mockFn(value);
			});

			expect(mockFn).toHaveBeenCalledWith(42);
			expect(tapped).toBe(result); // Same instance
			expect(tapped.isSuccess).toBe(true);
			expect(tapped.data).toBe(42);
		});

		it('should handle multiple taps', () => {
			const result = Result.ok('test');
			const mockFn1 = jest.fn();
			const mockFn2 = jest.fn();

			const tapped = result
				.tap(value => mockFn1(value))
				.tap(value => mockFn2(value));

			expect(mockFn1).toHaveBeenCalledWith('test');
			expect(mockFn2).toHaveBeenCalledWith('test');
			expect(tapped.isSuccess).toBe(true);
			expect(tapped.data).toBe('test');
		});

		it('should not execute side effect on failure', () => {
			const error = new ValidationError('Tap error');
			const result = Result.fail(error);
			const mockFn = jest.fn();

			const tapped = result.tap(value => {
				mockFn(value);
			});

			expect(mockFn).not.toHaveBeenCalled();
			expect(tapped).toBe(result); // Same instance
			expect(tapped.isFailure).toBe(true);
			expect(tapped.error).toBe(error);
		});
	});

	describe('mapError method', () => {
		it('should transform error on failure', () => {
			const originalError = new ValidationError('Original error');
			const result = Result.fail(originalError);

			const mappedError = result.mapError(error => {
				return new ProcessingError(`Transformed: ${error.message}`);
			});

			expect(mappedError.isFailure).toBe(true);
			expect(mappedError.error).toBeInstanceOf(ProcessingError);
			expect(mappedError.error.message).toBe('Transformed: Original error');
		});

		it('should convert between error types', () => {
			const domainError = new ValidationError('Validation failed');
			const result = Result.fail(domainError);

			const appError = result.mapError(error => {
				return new TestApplicationError(`App layer: ${error.message}`, 100);
			});

			expect(appError.isFailure).toBe(true);
			expect(appError.error).toBeInstanceOf(TestApplicationError);
			expect(appError.error.message).toBe('App layer: Validation failed');
		});

		it('should not transform error on success', () => {
			const result = Result.ok('success data');
			const mockFn = jest.fn();

			const mapped = result.mapError(_error => {
				mockFn();
				return new ProcessingError('Should not be called');
			});

			expect(mockFn).not.toHaveBeenCalled();
			expect(mapped.isSuccess).toBe(true);
			expect(mapped.data).toBe('success data');
		});
	});

	describe('mixed operations - success flow', () => {
		it('should combine chainAsync, tap, and map successfully', async () => {
			const sideEffects: string[] = [];

			const result = await Result.ok(10)
				.tap(value => sideEffects.push(`initial: ${value}`))
				.chainAsync(async value => {
					sideEffects.push(`chainAsyncing: ${value}`);
					await new Promise(resolve => setTimeout(resolve, 1));
					return Result.ok(value * 2);
				})
				.tap(value => sideEffects.push(`after chainAsync: ${value}`))
				.map(value => value + 5)
				.tap(value => sideEffects.push(`final: ${value}`))
				.toPromise();

			expect(result.isSuccess).toBe(true);
			expect(result.data).toBe(25); // 10 * 2 + 5
			expect(sideEffects).toEqual([
				'initial: 10',
				'chainAsyncing: 10',
				'after chainAsync: 20',
				'final: 25',
			]);
		});

		it('should handle complex data transformations with side effects', async () => {
			const logs: string[] = [];
			const user = { id: 1, email: 'john@example.com', name: 'John' };

			const result = await Result.ok(user)
				.tap(user => logs.push(`Processing user: ${user.name}`))
				.chainAsync(async user => {
					logs.push('Validating user...');
					return Result.ok({ ...user, validated: true });
				})
				.map(user => ({
					...user,
					displayName: user.name.toUpperCase(),
					processed: true,
				}))
				.tap(user => logs.push(`User processed: ${user.displayName}`))
				.toPromise();

			expect(result.isSuccess).toBe(true);
			expect(result.data).toEqual({
				id: 1,
				validated: true,
				displayName: 'JOHN',
				email: 'john@example.com',
				name: 'John',
				processed: true,
			});
			expect(logs).toEqual([
				'Processing user: John',
				'Validating user...',
				'User processed: JOHN',
			]);
		});
	});

	describe('mixed operations - error flow', () => {
		it('should short-circuit on chainAsync failure and skip subsequent operations', async () => {
			const sideEffects: string[] = [];
			const chainAsyncError = new ProcessingError('Chain failed');

			const result = await Result.ok(10)
				.tap(value => sideEffects.push(`initial: ${value}`))
				.chainAsync(async value => {
					sideEffects.push(`chainAsyncing: ${value}`);
					return Result.fail(chainAsyncError);
				})
				.tap(_value => sideEffects.push('should not execute'))
				.map(_value => _value + 5)
				.tap(_value => sideEffects.push('should not execute either'))
				.toPromise();

			expect(result.isFailure).toBe(true);
			expect(result.error).toBe(chainAsyncError);
			expect(sideEffects).toEqual(['initial: 10', 'chainAsyncing: 10']);
		});

		it('should handle initial failure and propagate through operations', async () => {
			const sideEffects: string[] = [];
			const initialError = new ValidationError('Initial failure');

			const result = await Result.fail(initialError)
				.tap(_value => sideEffects.push('should not execute'))
				.chainAsync(async _value => {
					sideEffects.push('should not execute');
					return Result.ok(_value);
				})
				.map(_value => _value)
				.tap(_value => sideEffects.push('should not execute'))
				.mapError(error => {
					sideEffects.push(`transforming error: ${error.message}`);
					return new ProcessingError(`Transformed: ${error.message}`);
				})
				.toPromise();

			expect(result.isFailure).toBe(true);
			expect(result.error).toBeInstanceOf(ProcessingError);
			expect(result.error.message).toBe('Transformed: Initial failure');
			expect(sideEffects).toEqual(['transforming error: Initial failure']);
		});

		it('should handle error transformation in complex flow', async () => {
			const logs: string[] = [];
			const validationError = new ValidationError('Invalid email');

			const result = await Result.ok({ email: 'invalid-email' })
				.tap(data => logs.push(`Processing: ${data.email}`))
				.chainAsync(async _data => {
					logs.push('Validating email...');
					return Result.fail(validationError);
				})
				.map(_data => ({ validated: true, email: 'invalid-email' }))
				.tap(_data => logs.push('Should not log'))
				.mapError(error => {
					logs.push(`Converting error: ${error.message}`);
					return new TestApplicationError(
						`Application error: ${error.message}`,
						200,
					);
				})
				.toPromise();

			expect(result.isFailure).toBe(true);
			expect(result.error).toBeInstanceOf(TestApplicationError);
			expect(result.error.message).toBe('Application error: Invalid email');
			expect(logs).toEqual([
				'Processing: invalid-email',
				'Validating email...',
				'Converting error: Invalid email',
			]);
		});
	});
});
