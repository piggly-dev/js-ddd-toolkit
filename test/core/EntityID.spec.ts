import { EntityID } from '@/index';
import { CustomValueObject, NumberID } from '@test/__stubs__';

describe('EntityID', () => {
	it('should have a default random id as uuidv4', () => {
		const id = new EntityID<string>();

		expect(id.value).toBeDefined();
		expect(typeof id.value).toBe('string');
		expect(id.value.length).toBe(36);
		expect(id.isRandom()).toBe(true);
		expect(id.toString()).toBe(id.value);
		expect(id.toNumber()).toBeNaN();
	});

	it('should have a string as id', () => {
		const id = new EntityID<string>('myid');

		expect(id.value).toBeDefined();
		expect(id.value).toBe('myid');
		expect(typeof id.value).toBe('string');
		expect(id.isRandom()).toBe(false);
		expect(id.toString()).toBe(id.value);
		expect(id.toNumber()).toBeNaN();
	});

	it('should have a number as id', () => {
		const id = new EntityID<number>(2);

		expect(id.value).toBeDefined();
		expect(id.value).toBe(2);
		expect(typeof id.value).toBe('number');
		expect(id.isRandom()).toBe(false);
		expect(id.toString()).toBe('2');
		expect(id.toNumber()).toBe(id.value);
	});

	it('should assert equality', () => {
		const one = new EntityID<number>(20);
		const two = new EntityID<number>(18);

		expect(one.equals(null)).toBe(false);
		expect(one.equals(undefined)).toBe(false);
		expect(one.equals(new CustomValueObject('name') as any)).toBe(false);
		expect(one.equals(two)).toBe(false);
		expect(one.equals(one)).toBe(true);
	});

	describe('Custom EntityID', () => {
		it('should have a default random id', () => {
			const id = new NumberID();

			expect(id.value).toBeDefined();
			expect(id.value <= 0).toBeTruthy();
			expect(typeof id.value).toBe('number');
			expect(id.isRandom()).toBe(true);
			expect(id.toNumber()).toBe(id.value);
		});

		it('should have a non random id', () => {
			const id = new NumberID(2);

			expect(id.value).toBeDefined();
			expect(id.value).toBe(2);
			expect(typeof id.value).toBe('number');
			expect(id.isRandom()).toBe(false);
			expect(id.toString()).toBe('2');
			expect(id.toNumber()).toBe(id.value);
		});
	});
});
