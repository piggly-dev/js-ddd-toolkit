import { CollectionOfEntity, Entity, EntityID } from '@/core';

class ConcreteEntity extends Entity<{}, number> {}

describe('CollectionOfEntity', () => {
	it('should evaluate common operations to the collection', () => {
		const collection = new CollectionOfEntity<ConcreteEntity>();
		const entity = new ConcreteEntity({}, new EntityID(10));

		expect(collection.length).toBe(0);
		expect(collection.has(new EntityID(10))).toBe(false);
		expect(collection.get(new EntityID(10))).toBeUndefined();

		collection.add(entity);

		expect(collection.length).toBe(1);
		expect(collection.get(new EntityID(10))).toBe(entity);
		expect(collection.has(new EntityID(10))).toBe(true);
		expect(collection.items).toStrictEqual([entity]);

		// will not add
		collection.add(entity);

		expect(collection.length).toBe(1);

		collection.remove(new EntityID(10));

		expect(collection.length).toBe(0);
		expect(collection.has(new EntityID(10))).toBe(false);
		expect(collection.get(new EntityID(10))).toBeUndefined();
	});
});
