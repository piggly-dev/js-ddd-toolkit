import { CollectionOfEntity, Entity, EntityID } from '@/index';

class ConcreteEntity extends Entity<{}, EntityID> {}

describe('CollectionOfEntity', () => {
	it('should evaluate common operations to the collection', () => {
		const collection = new CollectionOfEntity<ConcreteEntity>();
		const entity = new ConcreteEntity({}, new EntityID('10'));

		expect(collection.length).toBe(0);
		expect(collection.has(new EntityID('10'))).toBe(false);
		expect(collection.find(new EntityID('10'))).toBeUndefined();

		collection.add(entity);

		expect(collection.length).toBe(1);
		expect(collection.find(new EntityID('10'))).toBe(entity);
		expect(collection.has(new EntityID('10'))).toBe(true);
		expect(collection.entities).toStrictEqual([entity]);

		// will not add
		collection.add(entity);
		expect(collection.length).toBe(1);

		collection.remove(new EntityID('10'));

		expect(collection.length).toBe(0);
		expect(collection.has(new EntityID('10'))).toBe(false);
		expect(collection.find(new EntityID('10'))).toBeUndefined();
	});
});
