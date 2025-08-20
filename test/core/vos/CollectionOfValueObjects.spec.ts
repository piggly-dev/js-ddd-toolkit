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
		const emailHash = email.hash();

		expect(collection.length).toBe(1);
		expect(collection.get(emailHash)).toBe(email);
		expect(collection.has(email)).toBe(true);
		expect(collection.find(email)).toStrictEqual(email);
		expect(collection.arrayOf).toStrictEqual([email]);

		// will not add
		collection.add(email);

		expect(collection.length).toBe(1);
		expect(collection.get('nonexistent')).toBeUndefined();

		collection.remove(email);

		expect(collection.length).toBe(0);
		expect(collection.get(emailHash)).toBeUndefined();
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

		const collection = new CollectionOfValueObjects<EmailValueObject>(
			new Map([
				['alice@doe.com', new EmailValueObject('alice@doe.com')],
				['john@doe.com', new EmailValueObject('john@doe.com')],
			]),
		);

		expect(collection.hasAll(emails)).toBe(false);
	});

	it('should have any of value objects', () => {
		const emails = [
			new EmailValueObject('john@doe.com'),
			new EmailValueObject('alice@doe.com'),
		];

		const collection = new CollectionOfValueObjects<EmailValueObject>(
			new Map([
				[
					'ea07f1daccbf28fd709d51c82a16991d501e85d151b07786542820698881a229',
					new EmailValueObject('john@doe.com'),
				],
				['alfred@doe.com', new EmailValueObject('alfred@doe.com')],
			]),
		);

		expect(collection.hasAny(emails)).toBe(true);
	});

	it('should not have any of value objects', () => {
		const emails = [
			new EmailValueObject('paul@doe.com'),
			new EmailValueObject('alice@doe.com'),
		];

		const collection = new CollectionOfValueObjects<EmailValueObject>(
			new Map([
				['alfred@doe.com', new EmailValueObject('alfred@doe.com')],
				['john@doe.com', new EmailValueObject('john@doe.com')],
			]),
		);

		expect(collection.hasAny(emails)).toBe(false);
	});

	it('should initialize with Map of value objects', () => {
		const email1 = new EmailValueObject('john@example.com');
		const email2 = new EmailValueObject('jane@example.com');
		const initialMap = new Map([
			[email1.hash(), email1],
			[email2.hash(), email2],
		]);

		const collection = new CollectionOfValueObjects<EmailValueObject>(initialMap);

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

		// Test arrayOf instead of trying to iterate over iterators directly
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

	it('should sync items to collection', () => {
		const collection = new CollectionOfValueObjects<EmailValueObject>();
		const email = new EmailValueObject('sync@example.com');

		collection.sync(email);
		expect(collection.length).toBe(1);
		expect(collection.has(email)).toBe(true);

		// Sync again should not increase length (replaces existing)
		collection.sync(email);
		expect(collection.length).toBe(1);

		// Sync different email with same hash (edge case test)
		const sameHashEmail = new EmailValueObject('sync@example.com');
		collection.sync(sameHashEmail);
		expect(collection.length).toBe(1);
		expect(collection.get(email.hash())).toBe(sameHashEmail);
	});

	it('should sync many items to collection', () => {
		const collection = new CollectionOfValueObjects<EmailValueObject>();
		const emails = [
			new EmailValueObject('sync1@example.com'),
			new EmailValueObject('sync2@example.com'),
			new EmailValueObject('sync3@example.com'),
		];

		collection.syncMany(emails);

		expect(collection.length).toBe(3);
		emails.forEach(email => {
			expect(collection.has(email)).toBe(true);
		});
	});

	it('should append raw items to collection', () => {
		const collection = new CollectionOfValueObjects<EmailValueObject>();
		const email1 = new EmailValueObject('append1@example.com');
		const email2 = new EmailValueObject('append2@example.com');

		collection.appendRaw(email1);
		expect(collection.length).toBe(1);
		expect(collection.has(email1)).toBe(true);

		// appendRaw should always add/replace
		collection.appendRaw(email1);
		expect(collection.length).toBe(1);

		const emails = [email2, new EmailValueObject('append3@example.com')];
		collection.appendManyRaw(emails);
		expect(collection.length).toBe(3);
	});

	it('should handle hash-based operations', () => {
		const collection = new CollectionOfValueObjects<EmailValueObject>();
		const email = new EmailValueObject('hash@example.com');
		const hash = email.hash();

		collection.add(email);

		expect(collection.hasHash(hash)).toBe(true);
		expect(collection.hasHash('nonexistent')).toBe(false);

		expect(collection.get(hash)).toBe(email);
		expect(collection.get('nonexistent')).toBeUndefined();

		collection.removeHash(hash);
		expect(collection.length).toBe(0);
		expect(collection.hasHash(hash)).toBe(false);
	});

	it('should clone collection correctly', () => {
		const collection = new CollectionOfValueObjects<EmailValueObject>();
		const emails = [
			new EmailValueObject('clone1@example.com'),
			new EmailValueObject('clone2@example.com'),
		];

		collection.addMany(emails);

		const cloned = collection.clone();

		expect(cloned).toBeInstanceOf(CollectionOfValueObjects);
		expect(cloned).not.toBe(collection);
		expect(cloned.length).toBe(collection.length);

		// Should have same content but different instances
		emails.forEach(email => {
			expect(cloned.has(email)).toBe(true);
			const clonedEmail = cloned.find(email);
			expect(clonedEmail).not.toBe(email); // Different instance due to cloning
			expect(clonedEmail?.equals(email)).toBe(true);
		});
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

	it('should handle edge cases for find and get', () => {
		const collection = new CollectionOfValueObjects<EmailValueObject>();
		const email = new EmailValueObject('edge@example.com');

		// Empty collection
		expect(collection.find(email)).toBeUndefined();
		expect(collection.get('anything')).toBeUndefined();

		collection.add(email);

		// Valid finds
		expect(collection.find(email)).toBe(email);
		expect(collection.get(email.hash())).toBe(email);

		// Create email with same content but different instance
		const sameContentEmail = new EmailValueObject('edge@example.com');
		expect(collection.find(sameContentEmail)).toBe(email); // Should find the original
	});
});
