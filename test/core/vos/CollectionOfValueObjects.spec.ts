import { CollectionOfValueObjects, ValueObject } from '@/index';

class EmailValueObject extends ValueObject<{ value: string }> {
	constructor(email: string) {
		super({ value: email });
	}

	public get value(): string {
		return this.props.value;
	}

	public clone(): EmailValueObject {
		return new EmailValueObject(this.value);
	}
}

class NameValueObject extends ValueObject<{ first: string; last: string }> {
	constructor(first: string, last: string) {
		super({ first, last });
	}

	public get first(): string {
		return this.props.first;
	}

	public get last(): string {
		return this.props.last;
	}

	public clone(): NameValueObject {
		return new NameValueObject(this.first, this.last);
	}
}

describe('CollectionOfValueObjects', () => {
	it('should evaluate common operations to the collection', () => {
		const collection = new CollectionOfValueObjects<EmailValueObject>();
		const email = new EmailValueObject('john@doe.com');

		expect(collection.length).toBe(0);
		expect(collection.has(email)).toBe(false);
		expect(collection.find(email)).toBeUndefined();

		collection.add(email);

		expect(collection.length).toBe(1);
		expect(collection.has(email)).toBe(true);
		expect(collection.find(email)).toStrictEqual(email);
		expect(collection.arrayOf).toStrictEqual([email]);

		// will add again (Set allows duplicates with same content but different references)
		const sameEmail = new EmailValueObject('john@doe.com');
		collection.add(sameEmail);

		expect(collection.length).toBe(1); // Should still be 1 because Set uses equals for duplicates
		expect(collection.has(sameEmail)).toBe(true);

		collection.remove(email);

		expect(collection.length).toBe(0);
		expect(collection.has(email)).toBe(false);
		expect(collection.find(email)).toBeUndefined();

		// do nothing
		collection.remove(email);

		expect(collection.length).toBe(0);
	});

	it('should have all value objects', () => {
		const emails = [
			new EmailValueObject('john@doe.com'),
			new EmailValueObject('alice@doe.com'),
		];

		const collection = new CollectionOfValueObjects<EmailValueObject>();
		collection.addMany(emails);

		expect(collection.hasAll(emails)).toBe(true);
	});

	it('should not have all value objects', () => {
		const emails = [
			new EmailValueObject('paul@doe.com'),
			new EmailValueObject('alfred@doe.com'),
		];

		const collection = new CollectionOfValueObjects<EmailValueObject>();
		collection.addMany([
			new EmailValueObject('alice@doe.com'),
			new EmailValueObject('john@doe.com'),
		]);

		expect(collection.hasAll(emails)).toBe(false);
	});

	it('should have any of value objects', () => {
		const emails = [
			new EmailValueObject('john@doe.com'),
			new EmailValueObject('alice@doe.com'),
		];

		const collection = new CollectionOfValueObjects<EmailValueObject>();
		collection.addMany([
			new EmailValueObject('john@doe.com'),
			new EmailValueObject('alfred@doe.com'),
		]);

		expect(collection.hasAny(emails)).toBe(true);
	});

	it('should not have any of value objects', () => {
		const emails = [
			new EmailValueObject('paul@doe.com'),
			new EmailValueObject('alice@doe.com'),
		];

		const collection = new CollectionOfValueObjects<EmailValueObject>();
		collection.addMany([
			new EmailValueObject('alfred@doe.com'),
			new EmailValueObject('john@doe.com'),
		]);

		expect(collection.hasAny(emails)).toBe(false);
	});

	it('should initialize with Set of value objects', () => {
		const email1 = new EmailValueObject('john@example.com');
		const email2 = new EmailValueObject('jane@example.com');
		const initialSet = new Set([email1, email2]);

		const collection = new CollectionOfValueObjects<EmailValueObject>(initialSet);

		expect(collection.length).toBe(2);
		expect(collection.has(email1)).toBe(true);
		expect(collection.has(email2)).toBe(true);
	});

	it('should provide iterator access through entries and values', () => {
		const collection = new CollectionOfValueObjects<EmailValueObject>();
		const email1 = new EmailValueObject('test1@example.com');
		const email2 = new EmailValueObject('test2@example.com');

		collection.add(email1);
		collection.add(email2);

		// Test arrayOf
		expect(collection.arrayOf).toHaveLength(2);
		expect(collection.arrayOf).toContain(email1);
		expect(collection.arrayOf).toContain(email2);

		// Test that entries returns an iterator
		const entriesIterator = collection.entries;
		expect(typeof entriesIterator.next).toBe('function');

		// Test that values returns an iterator
		const valuesIterator = collection.values;
		expect(typeof valuesIterator.next).toBe('function');
	});

	it('should provide vos getter as alias for arrayOf', () => {
		const collection = new CollectionOfValueObjects<EmailValueObject>();
		const emails = [
			new EmailValueObject('vos1@example.com'),
			new EmailValueObject('vos2@example.com'),
		];

		collection.addMany(emails);

		expect(collection.vos).toEqual(collection.arrayOf);
		expect(collection.vos).toHaveLength(2);
		emails.forEach(email => {
			expect(collection.vos).toContain(email);
		});
	});

	it('should handle mixed value object types', () => {
		const collection = new CollectionOfValueObjects<
			EmailValueObject | NameValueObject
		>();
		const email = new EmailValueObject('mixed@example.com');
		const name = new NameValueObject('John', 'Doe');

		collection.add(email as any);
		collection.add(name as any);

		expect(collection.length).toBe(2);
		expect(collection.has(email as any)).toBe(true);
		expect(collection.has(name as any)).toBe(true);
	});

	it('should handle edge cases for find', () => {
		const collection = new CollectionOfValueObjects<EmailValueObject>();
		const email = new EmailValueObject('edge@example.com');

		// Empty collection
		expect(collection.find(email)).toBeUndefined();

		collection.add(email);

		// Valid finds
		expect(collection.find(email)).toBe(email);

		// Create email with same content but different instance
		const sameContentEmail = new EmailValueObject('edge@example.com');
		expect(collection.find(sameContentEmail)).toBe(email); // Should find the original
	});
});
