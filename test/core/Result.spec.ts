import { DomainError, Result } from '@/index';

class DefaultDomainError extends DomainError {
	constructor() {
		super('DefaultDomainError', 1, 'Error', 500);
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
});
