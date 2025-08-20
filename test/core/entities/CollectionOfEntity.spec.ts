import { CollectionOfEntity } from '@/core/entities/CollectionOfEntity.js';
import { NumberEntityId } from '@/core/entities/ids/NumberEntityId.js';
import { Entity } from '@/core/entities/Entity.js';

class ConcreteEntity extends Entity<{ a: number }, NumberEntityId> {}

describe('CollectionOfEntity', () => {
	it('should evaluate common operations to the collection', () => {
		const collection = new CollectionOfEntity<ConcreteEntity>();
		const entity = new ConcreteEntity({ a: 10 }, new NumberEntityId(10));

		expect(collection.length).toBe(0);
		expect(collection.has(new NumberEntityId(10))).toBe(false);
		expect(collection.find(new NumberEntityId(10))).toBeUndefined();

		collection.add(entity);

		expect(collection.length).toBe(1);
		expect(collection.find(new NumberEntityId(10))).toBe(entity);
		expect(collection.has(new NumberEntityId(10))).toBe(true);
		expect(collection.entities).toStrictEqual([entity]);

		// will not add
		collection.add(entity);
		expect(collection.length).toBe(1);

		collection.remove(new NumberEntityId(10));

		expect(collection.length).toBe(0);
		expect(collection.has(new NumberEntityId(10))).toBe(false);
		expect(collection.find(new NumberEntityId(10))).toBeUndefined();
	});
});
