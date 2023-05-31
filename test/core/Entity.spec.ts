import { Entity, EntityID, ValueObject } from '@/core';

class ConcreteEntity extends Entity<{ a: number }, number> {}

describe('Entity', () => {
	it('should have a default random id', () => {
		const entity = new ConcreteEntity({ a: 10 });

		expect(entity.id.value).toBeDefined();
		expect(entity.id.isRandom()).toBe(true);
	});

	it('should have an id', () => {
		const id = new EntityID(10);
		const entity = new ConcreteEntity({ a: 10 }, id);

		expect(entity.id.equals(id)).toBe(true);
	});

	it('should assert equality of entities', () => {
		const one = new ConcreteEntity({ a: 10 }, new EntityID(10));
		const two = new ConcreteEntity({ a: 10 });
		const three = new ConcreteEntity({ a: 10 }, new EntityID(10));

		expect(one.equals(null)).toBe(false);
		expect(one.equals(undefined)).toBe(false);
		expect(one.equals(new ValueObject({}) as any)).toBe(false);
		expect(one.equals(two)).toBe(false);
		expect(one.equals(one)).toBe(true);
		expect(one.equals(three)).toBe(true);
	});
});
