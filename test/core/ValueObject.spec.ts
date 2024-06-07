import { EntityID, ValueObject } from '@/index';

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
});
