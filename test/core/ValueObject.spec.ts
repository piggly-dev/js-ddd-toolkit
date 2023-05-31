import { EntityID, ValueObject } from '@/core';

describe('ValueObjects', () => {
	it('should assert equality of value objects', () => {
		const one = new ValueObject({ a: 1, b: 2 });
		const two = new ValueObject({ a: 2, b: 4 });

		expect(one.equals(null)).toBe(false);
		expect(one.equals(undefined)).toBe(false);
		expect(one.equals(new EntityID(1) as any)).toBe(false);
		expect(one.equals(two)).toBe(false);
		expect(one.equals(one)).toBe(true);
	});
});
