import { CollectionOfValueObjects, ValueObject } from '@/core';

class EmailValueObject extends ValueObject<{ value: string }> {}

describe('CollectionOfValueObject', () => {
	it('should evaluate common operations to the collection', () => {
		const collection = new CollectionOfValueObjects<EmailValueObject>();
		const email = new EmailValueObject({ value: 'john@doe.com' });

		expect(collection.length).toBe(0);
		expect(collection.has(email)).toBe(false);
		expect(collection.find(email)).toBeUndefined();

		collection.add(email);

		expect(collection.length).toBe(1);
		expect(collection.get(0)).toBe(email);
		expect(collection.has(email)).toBe(true);
		expect(collection.find(email)).toStrictEqual(email);
		expect(collection.items).toStrictEqual([email]);

		// will not add
		collection.add(email);

		expect(collection.length).toBe(1);
		expect(collection.get(1)).toBeUndefined();

		collection.remove(email);

		expect(collection.length).toBe(0);
		expect(collection.get(0)).toBeUndefined();
		expect(collection.has(email)).toBe(false);
		expect(collection.find(email)).toBeUndefined();

		// do nothing
		collection.remove(email);

		expect(collection.length).toBe(0);
	});

	it('should have all value objects', () => {
		const emails = [
			new EmailValueObject({ value: 'john@doe.com' }),
			new EmailValueObject({ value: 'alice@doe.com' }),
		];

		const collection = new CollectionOfValueObjects<EmailValueObject>(emails);

		expect(collection.hasAll(emails)).toBe(true);
	});

	it('should not have all value objects', () => {
		const emails = [
			new EmailValueObject({ value: 'paul@doe.com' }),
			new EmailValueObject({ value: 'alfred@doe.com' }),
		];

		const collection = new CollectionOfValueObjects<EmailValueObject>([
			new EmailValueObject({ value: 'john@doe.com' }),
			new EmailValueObject({ value: 'alice@doe.com' }),
		]);

		expect(collection.hasAll(emails)).toBe(false);
	});

	it('should have any of value objects', () => {
		const emails = [
			new EmailValueObject({ value: 'john@doe.com' }),
			new EmailValueObject({ value: 'alice@doe.com' }),
		];

		const collection = new CollectionOfValueObjects<EmailValueObject>([
			new EmailValueObject({ value: 'john@doe.com' }),
			new EmailValueObject({ value: 'alfred@doe.com' }),
		]);

		expect(collection.hasAny(emails)).toBe(true);
	});

	it('should not have any of value objects', () => {
		const emails = [
			new EmailValueObject({ value: 'paul@doe.com' }),
			new EmailValueObject({ value: 'alice@doe.com' }),
		];

		const collection = new CollectionOfValueObjects<EmailValueObject>([
			new EmailValueObject({ value: 'john@doe.com' }),
			new EmailValueObject({ value: 'alfred@doe.com' }),
		]);

		expect(collection.hasAny(emails)).toBe(false);
	});
});
