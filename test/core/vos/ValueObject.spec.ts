import { ValueObject, EntityID } from '@/index';

class ConcreteValueObject extends ValueObject<{ a: number; b: number }> {
	constructor(a: number, b: number) {
		super({ a, b });
	}

	public get a(): number {
		return this.props.a;
	}

	public get b(): number {
		return this.props.b;
	}

	public static create(a: number, b: number): ConcreteValueObject {
		return new ConcreteValueObject(a, b);
	}
}

class EmailValueObject extends ValueObject<{ value: string }> {
	constructor(email: string) {
		super({ value: email });
	}

	public get value(): string {
		return this.props.value;
	}
}

describe('ValueObjects', () => {
	it('should assert equality of value objects', () => {
		const one = new ConcreteValueObject(1, 2);
		const two = new ConcreteValueObject(2, 4);
		const three = new ConcreteValueObject(1, 2);

		expect(one.equals(null)).toBe(false);
		expect(one.equals(undefined)).toBe(false);
		expect(one.equals(new EntityID(1) as any)).toBe(false);
		expect(one.equals(two)).toBe(false);
		expect(one.equals(one)).toBe(true);
		expect(one.equals(three)).toBe(true);
	});

	it('should create value object with frozen props', () => {
		const vo = new ConcreteValueObject(1, 2);

		expect(Object.isFrozen(vo.props)).toBe(true);
		expect(() => {
			(vo.props as any).a = 3;
		}).toThrow();
	});

	it('should access props correctly', () => {
		const vo = new ConcreteValueObject(5, 10);

		expect(vo.props).toEqual({ a: 5, b: 10 });
		expect(vo.a).toBe(5);
		expect(vo.b).toBe(10);
	});

	it('should generate consistent hash for same props', () => {
		const vo1 = new ConcreteValueObject(1, 2);
		const vo2 = new ConcreteValueObject(1, 2);
		const vo3 = new ConcreteValueObject(2, 1);

		expect(vo1.hash()).toBe(vo2.hash());
		expect(vo1.hash()).not.toBe(vo3.hash());
		expect(typeof vo1.hash()).toBe('string');
		expect(vo1.hash().length).toBe(64); // SHA256 hex length
	});

	it('should identify component type correctly', () => {
		const vo = new ConcreteValueObject(1, 2);

		expect(vo.is('valueobject')).toBe(true);
		expect(vo.is('entity')).toBe(false);
		expect(vo.is('attribute')).toBe(false);
		expect(vo.is('ValueObject')).toBe(false); // case sensitive
	});

	it('should work with different prop types', () => {
		const email = new EmailValueObject('test@example.com');
		const anotherEmail = new EmailValueObject('test@example.com');
		const differentEmail = new EmailValueObject('different@example.com');

		expect(email.equals(anotherEmail)).toBe(true);
		expect(email.equals(differentEmail)).toBe(false);
		expect(email.value).toBe('test@example.com');
	});

	it('should handle complex object props', () => {
		class ComplexValueObject extends ValueObject<{
			data: { array: number[]; nested: string };
			timestamp: Date;
		}> {
			constructor(data: { array: number[]; nested: string }, timestamp: Date) {
				super({ data, timestamp });
			}
		}

		const date = new Date('2023-01-01');
		const vo1 = new ComplexValueObject({ array: [1, 2, 3], nested: 'test' }, date);
		const vo2 = new ComplexValueObject({ array: [1, 2, 3], nested: 'test' }, date);
		const vo3 = new ComplexValueObject(
			{ array: [1, 2, 3], nested: 'different' },
			date,
		);

		expect(vo1.equals(vo2)).toBe(true);
		expect(vo1.equals(vo3)).toBe(false);
		expect(vo1.hash()).toBe(vo2.hash());
		expect(vo1.hash()).not.toBe(vo3.hash());
	});

	it('should handle edge cases for equality', () => {
		const vo = new ConcreteValueObject(1, 2);
		const mockInvalidObject = {
			hash: () => 'invalid',
			is: () => false,
			props: { a: 1, b: 2 },
		};

		expect(vo.equals(mockInvalidObject as any)).toBe(false);
	});

	it('should handle different hash equality check', () => {
		const vo1 = new ConcreteValueObject(1, 2);
		const mockDifferentHash = {
			hash: () => 'different-hash',
			is: () => true,
			props: { a: 1, b: 2 },
		};

		// hash is different, but props are the same
		expect(vo1.equals(mockDifferentHash as any)).toBe(true);
	});
});
