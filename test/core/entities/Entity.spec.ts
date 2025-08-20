import { NumberEntityId } from '@/core/entities/ids/NumberEntityId.js';
import { StringEntityId } from '@/core/entities/ids/StringEntityId.js';
import { Entity } from '@/core/entities/Entity.js';

class ConcreteEntity extends Entity<{ a: number }, NumberEntityId> {
	protected generateId() {
		return new NumberEntityId();
	}
}

describe('Entity', () => {
	it('should have a default random id', () => {
		const entity = new ConcreteEntity({ a: 10 });

		expect(entity.id.value).toBeDefined();
		expect(entity.id.isRandom()).toBe(true);
		expect(entity.id).toBeInstanceOf(NumberEntityId);
	});

	it('should have an id', () => {
		const id = new NumberEntityId(10);
		const entity = new ConcreteEntity({ a: 10 }, id);

		expect(entity.id.equals(id)).toBe(true);
	});

	it('should assert equality of entities', () => {
		const one = new ConcreteEntity({ a: 10 }, new NumberEntityId(10));
		const two = new ConcreteEntity({ a: 10 });
		const three = new ConcreteEntity({ a: 10 }, new NumberEntityId(10));

		expect(one.equals(null)).toBe(false);
		expect(one.equals(undefined)).toBe(false);
		expect(one.equals(new StringEntityId('name') as any)).toBe(false);
		expect(one.equals(two)).toBe(false);
		expect(one.equals(one)).toBe(true);
		expect(one.equals(three)).toBe(true);
	});
});
