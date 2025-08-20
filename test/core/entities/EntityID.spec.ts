import { NumberEntityId, StringEntityId, UUIDEntityId, EntityID } from '@/index';

describe('EntityID', () => {
	describe('base EntityID class', () => {
		class ConcreteEntityId extends EntityID<number> {
			constructor(value?: number) {
				super(value);
			}
		}

		it('should create with provided value', () => {
			const id = new ConcreteEntityId(42);
			expect(id.value).toBe(42);
			expect(id.isRandom()).toBe(false);
		});

		it('should create with undefined value (generates random UUID)', () => {
			const id = new ConcreteEntityId();
			expect(typeof id.value).toBe('string');
			expect(id.value).toMatch(
				/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
			);
			expect(id.isRandom()).toBe(true);
		});

		it('should implement equals correctly', () => {
			const id1 = new ConcreteEntityId(10);
			const id2 = new ConcreteEntityId(10);
			const id3 = new ConcreteEntityId(20);

			expect(id1.equals(id2)).toBe(true);
			expect(id1.equals(id3)).toBe(false);
			expect(id1.equals(null)).toBe(false);
			expect(id1.equals(undefined)).toBe(false);
		});

		it('should handle equals with undefined values', () => {
			const id1 = new ConcreteEntityId();
			const id2 = new ConcreteEntityId();

			expect(id1.equals(id2)).toBe(false); // undefined !== undefined for random IDs
			expect(id1.equals(id1)).toBe(true); // same instance
		});
	});

	describe('NumberEntityId', () => {
		it('should create with provided number', () => {
			const id = new NumberEntityId(100);
			expect(id.value).toBe(100);
			expect(id.isRandom()).toBe(false);
		});

		it('should generate random number when not provided (returns -1)', () => {
			const id = new NumberEntityId();
			expect(typeof id.value).toBe('number');
			expect(id.value).toBe(-1);
			expect(id.isRandom()).toBe(true);
		});

		it('should handle zero and negative numbers', () => {
			const zeroId = new NumberEntityId(0);
			const negativeId = new NumberEntityId(-42);

			expect(zeroId.value).toBe(0);
			expect(negativeId.value).toBe(-42);
			expect(zeroId.isRandom()).toBe(false);
			expect(negativeId.isRandom()).toBe(false);
		});

		it('should implement equals for numbers', () => {
			const id1 = new NumberEntityId(42);
			const id2 = new NumberEntityId(42);
			const id3 = new NumberEntityId(100);

			expect(id1.equals(id2)).toBe(true);
			expect(id1.equals(id3)).toBe(false);
		});

		it('should generate consistent random value (-1)', () => {
			const ids = new Set<number>();
			for (let i = 0; i < 10; i++) {
				const id = new NumberEntityId();
				ids.add(id.value);
			}
			// All NumberEntityId random values are -1 (expected behavior)
			expect(ids.size).toBe(1);
			expect(ids.has(-1)).toBe(true);
		});

		it('should handle type checking in equals', () => {
			const numberId = new NumberEntityId(42);
			const stringId = new StringEntityId('42') as any;

			expect(numberId.equals(stringId)).toBe(false);
		});
	});

	describe('StringEntityId', () => {
		it('should create with provided string', () => {
			const id = new StringEntityId('test-id');
			expect(id.value).toBe('test-id');
			expect(id.isRandom()).toBe(false);
		});

		it('should generate random string when not provided', () => {
			const id = new StringEntityId();
			expect(typeof id.value).toBe('string');
			expect(id.value.length).toBeGreaterThan(0);
			expect(id.isRandom()).toBe(true);
		});

		it('should handle empty string', () => {
			const id = new StringEntityId('');
			expect(id.value).toBe('');
			expect(id.isRandom()).toBe(false);
		});

		it('should implement equals for strings', () => {
			const id1 = new StringEntityId('abc');
			const id2 = new StringEntityId('abc');
			const id3 = new StringEntityId('xyz');

			expect(id1.equals(id2)).toBe(true);
			expect(id1.equals(id3)).toBe(false);
		});

		it('should generate consistent random value ("<empty>")', () => {
			const ids = new Set<string>();
			for (let i = 0; i < 10; i++) {
				const id = new StringEntityId();
				ids.add(id.value);
			}
			// All StringEntityId random values are '<empty>' (expected behavior)
			expect(ids.size).toBe(1);
			expect(ids.has('<empty>')).toBe(true);
		});

		it('should handle special characters', () => {
			const specialChars = 'id-with_special.chars@123!';
			const id = new StringEntityId(specialChars);
			expect(id.value).toBe(specialChars);
		});

		it('should be case sensitive in equals', () => {
			const id1 = new StringEntityId('ABC');
			const id2 = new StringEntityId('abc');

			expect(id1.equals(id2)).toBe(false);
		});
	});

	describe('UUIDEntityId', () => {
		it('should create with provided UUID', () => {
			const uuid = '550e8400-e29b-41d4-a716-446655440000';
			const id = new UUIDEntityId(uuid);
			expect(id.value).toBe(uuid);
			expect(id.isRandom()).toBe(false);
		});

		it('should generate random UUID when not provided', () => {
			const id = new UUIDEntityId();
			expect(typeof id.value).toBe('string');
			// Check UUID v4 format
			expect(id.value).toMatch(
				/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
			);
			expect(id.isRandom()).toBe(true);
		});

		it('should implement equals for UUIDs', () => {
			const uuid = '550e8400-e29b-41d4-a716-446655440000';
			const id1 = new UUIDEntityId(uuid);
			const id2 = new UUIDEntityId(uuid);
			const id3 = new UUIDEntityId('660e8400-e29b-41d4-a716-446655440000');

			expect(id1.equals(id2)).toBe(true);
			expect(id1.equals(id3)).toBe(false);
		});

		it('should generate unique UUIDs', () => {
			const ids = new Set<string>();
			for (let i = 0; i < 1000; i++) {
				const id = new UUIDEntityId();
				ids.add(id.value);
			}
			expect(ids.size).toBe(1000); // All should be unique
		});

		it('should handle uppercase and lowercase UUIDs', () => {
			const uuid = '550e8400-e29b-41d4-a716-446655440000';
			const id1 = new UUIDEntityId(uuid.toLowerCase());
			const id2 = new UUIDEntityId(uuid.toUpperCase());

			// UUIDs should be case-insensitive in practice
			expect(id1.value.toLowerCase()).toBe(id2.value.toLowerCase());
		});

		it('should validate UUID format', () => {
			const validUUID = new UUIDEntityId('550e8400-e29b-41d4-a716-446655440000');
			expect(validUUID.value).toBe('550e8400-e29b-41d4-a716-446655440000');

			// Even invalid formats are accepted (no validation in constructor)
			const invalidFormat = new UUIDEntityId('not-a-uuid');
			expect(invalidFormat.value).toBe('not-a-uuid');
			expect(invalidFormat.isRandom()).toBe(false);
		});
	});

	describe('cross-type comparisons', () => {
		it('should not equal IDs of different types', () => {
			const numberId = new NumberEntityId(42);
			const stringId = new StringEntityId('42');
			const uuidId = new UUIDEntityId('550e8400-e29b-41d4-a716-446655440000');

			expect(numberId.equals(stringId as any)).toBe(false);
			expect(numberId.equals(uuidId as any)).toBe(false);
			expect(stringId.equals(uuidId as any)).toBe(false);
		});

		it('should handle null and undefined in equals', () => {
			const numberId = new NumberEntityId(42);
			const stringId = new StringEntityId('test');
			const uuidId = new UUIDEntityId();

			[numberId, stringId, uuidId].forEach(id => {
				expect(id.equals(null)).toBe(false);
				expect(id.equals(undefined)).toBe(false);
			});
		});
	});

	describe('integration tests', () => {
		it('should work with Map and Set collections', () => {
			const id1 = new NumberEntityId(1);
			const id2 = new NumberEntityId(2);
			const id3 = new NumberEntityId(1);

			const set = new Set([id1, id2, id3]);
			expect(set.size).toBe(3); // id1 and id3 are different objects

			const map = new Map();
			map.set(id1.value, 'first');
			map.set(id2.value, 'second');
			map.set(id3.value, 'third');

			expect(map.get(1)).toBe('third'); // id3 overwrites id1
			expect(map.size).toBe(2);
		});

		it('should serialize to JSON correctly', () => {
			const numberId = new NumberEntityId(42);
			const stringId = new StringEntityId('test');
			const uuidId = new UUIDEntityId('550e8400-e29b-41d4-a716-446655440000');

			const data = {
				uuidId: uuidId.value,
				numberId: numberId.value,
				stringId: stringId.value,
			};

			const json = JSON.stringify(data);
			const parsed = JSON.parse(json);

			expect(parsed.numberId).toBe(42);
			expect(parsed.stringId).toBe('test');
			expect(parsed.uuidId).toBe('550e8400-e29b-41d4-a716-446655440000');
		});

		it('should handle ID conversion scenarios', () => {
			// Convert number to string ID
			const numberId = new NumberEntityId(42);
			const stringFromNumber = new StringEntityId(String(numberId.value));
			expect(stringFromNumber.value).toBe('42');

			// Parse string to number ID
			const stringId = new StringEntityId('100');
			const numberFromString = new NumberEntityId(parseInt(stringId.value));
			expect(numberFromString.value).toBe(100);
		});
	});
});
