import { Entity } from '@/index';
import { CustomValueObject, NumberID } from '@test/__stubs__';

class ConcreteEntity extends Entity<{ a: number }, NumberID> {
	protected generateId() {
		return new NumberID();
	}
}

describe('Entity', () => {
	it('should have a default random id', () => {
		const entity = new ConcreteEntity({ a: 10 });

		expect(entity.id.value).toBeDefined();
		expect(entity.id.isRandom()).toBe(true);
		expect(entity.id).toBeInstanceOf(NumberID);
	});

	it('should have an id', () => {
		const id = new NumberID(10);
		const entity = new ConcreteEntity({ a: 10 }, id);

		expect(entity.id.equals(id)).toBe(true);
	});

	it('should assert equality of entities', () => {
		const one = new ConcreteEntity({ a: 10 }, new NumberID(10));
		const two = new ConcreteEntity({ a: 10 });
		const three = new ConcreteEntity({ a: 10 }, new NumberID(10));

		expect(one.equals(null)).toBe(false);
		expect(one.equals(undefined)).toBe(false);
		expect(one.equals(new CustomValueObject('name') as any)).toBe(false);
		expect(one.equals(two)).toBe(false);
		expect(one.equals(one)).toBe(true);
		expect(one.equals(three)).toBe(true);
	});
});
