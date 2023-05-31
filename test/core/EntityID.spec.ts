import { EntityID, ValueObject } from '@/core';

describe('EntityID', () => {
	it('should have a default random id', () => {
		const id = new EntityID();

		expect(id.value).toBeDefined();
		expect(typeof id.value).toBe('string');
		expect(id.value.length).toBe(36);
		expect(id.isRandom()).toBe(true);
		expect(id.toString()).toBe(id.value);
		expect(id.toNumber()).toBeNaN();
	});

	it('should have a string as id', () => {
		const id = new EntityID('myid');

		expect(id.value).toBeDefined();
		expect(id.value).toBe('myid');
		expect(typeof id.value).toBe('string');
		expect(id.isRandom()).toBe(false);
		expect(id.toString()).toBe(id.value);
		expect(id.toNumber()).toBeNaN();
	});

	it('should have a number as id', () => {
		const id = new EntityID(2);

		expect(id.value).toBeDefined();
		expect(id.value).toBe(2);
		expect(typeof id.value).toBe('number');
		expect(id.isRandom()).toBe(false);
		expect(id.toString()).toBe('2');
		expect(id.toNumber()).toBe(id.value);
	});

	it('should assert equality of value objects', () => {
		const one = new EntityID(20);
		const two = new EntityID(18);

		expect(one.equals(null)).toBe(false);
		expect(one.equals(undefined)).toBe(false);
		expect(one.equals(new ValueObject({}) as any)).toBe(false);
		expect(one.equals(two)).toBe(false);
		expect(one.equals(one)).toBe(true);
	});
});
