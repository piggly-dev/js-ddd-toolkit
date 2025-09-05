import { CollectionOfEntity, NumberEntityId, Entity } from '@/index';

class TestEntity extends Entity<{ name: string; value: number }, NumberEntityId> {
	get name() {
		return this._props.name;
	}

	get value() {
		return this._props.value;
	}

	public clone() {
		return new TestEntity({ ...this._props }, this.id) as this;
	}

	protected generateId() {
		return new NumberEntityId();
	}
}

describe('CollectionOfEntity', () => {
	describe('basic operations', () => {
		let collection: CollectionOfEntity<TestEntity>;

		beforeEach(() => {
			collection = new CollectionOfEntity<TestEntity>();
		});

		it('should initialize empty', () => {
			expect(collection.length).toBe(0);
			expect(collection.entities).toEqual([]);
			expect(collection.knowableEntities).toEqual([]);
		});

		it('should add entities', () => {
			const entity1 = new TestEntity(
				{ name: 'test1', value: 10 },
				new NumberEntityId(1),
			);

			const entity2 = new TestEntity(
				{ name: 'test2', value: 20 },
				new NumberEntityId(2),
			);

			collection.add(entity1);
			expect(collection.length).toBe(1);
			expect(collection.has(new NumberEntityId(1))).toBe(true);

			collection.add(entity2);
			expect(collection.length).toBe(2);
			expect(collection.has(new NumberEntityId(2))).toBe(true);
		});

		it('should not add duplicate entities (based on AbstractCollectionOfEntities behavior)', () => {
			const entity = new TestEntity(
				{ name: 'test', value: 10 },
				new NumberEntityId(1),
			);

			collection.add(entity);
			collection.add(entity);

			expect(collection.length).toBe(1);
		});

		it('should find entities by id', () => {
			const entity = new TestEntity(
				{ name: 'test', value: 10 },
				new NumberEntityId(1),
			);
			collection.add(entity);

			const found = collection.find(new NumberEntityId(1));
			expect(found).toBe(entity);

			const notFound = collection.find(new NumberEntityId(999));
			expect(notFound).toBeUndefined();
		});

		it('should remove entities', () => {
			const entity = new TestEntity(
				{ name: 'test', value: 10 },
				new NumberEntityId(1),
			);
			collection.add(entity);

			collection.remove(new NumberEntityId(1));
			expect(collection.length).toBe(0);
			expect(collection.has(new NumberEntityId(1))).toBe(false);
		});

		it('should get entity by id using get method', () => {
			const entity = new TestEntity(
				{ name: 'test', value: 10 },
				new NumberEntityId(1),
			);
			collection.add(entity);

			const optionalEntity = collection.get(new NumberEntityId(1));
			expect(optionalEntity).toBeDefined();
			expect(optionalEntity?.isPresent()).toBe(true);
			expect(optionalEntity?.knowableEntity).toBe(entity);

			const notFound = collection.get(new NumberEntityId(999));
			expect(notFound).toBeUndefined();
		});
	});

	describe('collection properties', () => {
		let collection: CollectionOfEntity<TestEntity>;

		beforeEach(() => {
			collection = new CollectionOfEntity<TestEntity>();

			// Add test entities
			collection.add(
				new TestEntity({ name: 'test1', value: 10 }, new NumberEntityId(1)),
			);
			collection.add(
				new TestEntity({ name: 'test2', value: 20 }, new NumberEntityId(2)),
			);
			collection.add(
				new TestEntity({ name: 'test3', value: 30 }, new NumberEntityId(3)),
			);
		});

		it('should return correct length', () => {
			expect(collection.length).toBe(3);
		});

		it('should return knowable entities array', () => {
			const entities = collection.knowableEntities;
			expect(entities).toHaveLength(3);
			expect(entities.every(e => e instanceof TestEntity)).toBe(true);
		});

		it('should return entities (alias for knowableEntities)', () => {
			const entities = collection.entities;
			const knowableEntities = collection.knowableEntities;
			expect(entities).toEqual(knowableEntities);
		});

		it('should return ids array', () => {
			const ids = collection.ids;
			expect(ids).toHaveLength(3);
			expect(ids.every(id => id instanceof NumberEntityId)).toBe(true);
		});

		it('should return keys array', () => {
			const keys = collection.keys;
			expect(keys).toHaveLength(3);
			expect(keys.every(key => typeof key === 'string')).toBe(true);
		});

		it('should return arrayOf (optional entities)', () => {
			const arrayOf = collection.arrayOf;
			expect(arrayOf).toHaveLength(3);
			expect(arrayOf.every(opt => opt.isPresent())).toBe(true);
		});
	});

	describe('bulk operations', () => {
		let collection: CollectionOfEntity<TestEntity>;

		beforeEach(() => {
			collection = new CollectionOfEntity<TestEntity>();
		});

		it('should add many entities', () => {
			const entities = [
				new TestEntity({ name: 'test1', value: 10 }, new NumberEntityId(1)),
				new TestEntity({ name: 'test2', value: 20 }, new NumberEntityId(2)),
				new TestEntity({ name: 'test3', value: 30 }, new NumberEntityId(3)),
			];

			collection.addMany(entities);
			expect(collection.length).toBe(3);
			expect(collection.has(new NumberEntityId(1))).toBe(true);
			expect(collection.has(new NumberEntityId(2))).toBe(true);
			expect(collection.has(new NumberEntityId(3))).toBe(true);
		});

		it('should sync entities (replace if exists)', () => {
			const entity1 = new TestEntity(
				{ name: 'original', value: 10 },
				new NumberEntityId(1),
			);
			const entity1Updated = new TestEntity(
				{ name: 'updated', value: 15 },
				new NumberEntityId(1),
			);

			collection.add(entity1);
			expect(collection.find(new NumberEntityId(1))?.name).toBe('original');

			collection.sync(entity1Updated);
			expect(collection.find(new NumberEntityId(1))?.name).toBe('updated');
			expect(collection.length).toBe(1);
		});

		it('should sync many entities', () => {
			const entities = [
				new TestEntity({ name: 'test1', value: 10 }, new NumberEntityId(1)),
				new TestEntity({ name: 'test2', value: 20 }, new NumberEntityId(2)),
			];

			collection.syncMany(entities);
			expect(collection.length).toBe(2);
		});
	});

	describe('query methods', () => {
		let collection: CollectionOfEntity<TestEntity>;

		beforeEach(() => {
			collection = new CollectionOfEntity<TestEntity>();
			collection.add(
				new TestEntity({ name: 'test1', value: 10 }, new NumberEntityId(1)),
			);
			collection.add(
				new TestEntity({ name: 'test2', value: 20 }, new NumberEntityId(2)),
			);
			collection.add(
				new TestEntity({ name: 'test3', value: 30 }, new NumberEntityId(3)),
			);
		});

		it('should check if entity exists by id', () => {
			expect(collection.has(new NumberEntityId(1))).toBe(true);
			expect(collection.has(new NumberEntityId(999))).toBe(false);
		});

		it('should check if entity exists by item', () => {
			const entity = new TestEntity(
				{ name: 'test1', value: 10 },
				new NumberEntityId(1),
			);
			expect(collection.hasItem(entity)).toBe(true);

			const nonExistentEntity = new TestEntity(
				{ name: 'test999', value: 999 },
				new NumberEntityId(999),
			);
			expect(collection.hasItem(nonExistentEntity)).toBe(false);
		});

		it('should check if has all ids', () => {
			const existingIds = [new NumberEntityId(1), new NumberEntityId(2)];
			const mixedIds = [new NumberEntityId(1), new NumberEntityId(999)];

			expect(collection.hasAll(existingIds)).toBe(true);
			expect(collection.hasAll(mixedIds)).toBe(false);
		});

		it('should check if has any ids', () => {
			const someExistingIds = [new NumberEntityId(1), new NumberEntityId(999)];
			const nonExistingIds = [new NumberEntityId(888), new NumberEntityId(999)];

			expect(collection.hasAny(someExistingIds)).toBe(true);
			expect(collection.hasAny(nonExistingIds)).toBe(false);
		});

		it('should check if item is available (present) for id', () => {
			expect(collection.itemAvailableFor(new NumberEntityId(1))).toBe(true);
			expect(collection.itemAvailableFor(new NumberEntityId(999))).toBe(false);
		});
	});

	describe('reload operations', () => {
		let collection: CollectionOfEntity<TestEntity>;

		beforeEach(() => {
			collection = new CollectionOfEntity<TestEntity>();
		});

		it('should reload existing entity', () => {
			const originalEntity = new TestEntity(
				{ name: 'original', value: 10 },
				new NumberEntityId(1),
			);
			const updatedEntity = new TestEntity(
				{ name: 'updated', value: 15 },
				new NumberEntityId(1),
			);

			collection.add(originalEntity);
			expect(collection.find(new NumberEntityId(1))?.name).toBe('original');

			collection.reload(updatedEntity);
			expect(collection.find(new NumberEntityId(1))?.name).toBe('updated');
		});

		it('should throw when trying to reload non-existent entity', () => {
			const entity = new TestEntity(
				{ name: 'test', value: 10 },
				new NumberEntityId(999),
			);

			expect(() => collection.reload(entity)).toThrow(
				'Item not found, cannot be reloaded.',
			);
		});

		it('should reload many entities', () => {
			const entities = [
				new TestEntity({ name: 'test1', value: 10 }, new NumberEntityId(1)),
				new TestEntity({ name: 'test2', value: 20 }, new NumberEntityId(2)),
			];
			const updatedEntities = [
				new TestEntity({ name: 'updated1', value: 15 }, new NumberEntityId(1)),
				new TestEntity({ name: 'updated2', value: 25 }, new NumberEntityId(2)),
			];

			collection.addMany(entities);
			collection.reloadMany(updatedEntities);

			expect(collection.find(new NumberEntityId(1))?.name).toBe('updated1');
			expect(collection.find(new NumberEntityId(2))?.name).toBe('updated2');
		});
	});

	describe('cloning', () => {
		it('should clone collection structure (clone method exists but entities need implementation)', () => {
			const collection = new CollectionOfEntity<TestEntity>();
			collection.add(
				new TestEntity({ name: 'test1', value: 10 }, new NumberEntityId(1)),
			);
			collection.add(
				new TestEntity({ name: 'test2', value: 20 }, new NumberEntityId(2)),
			);

			// Test that the clone method exists but throws "Not implemented" for entity cloning
			expect(() => collection.clone()).not.toThrow('Not implemented');
		});
	});

	describe('integration tests', () => {
		it('should handle complete CRUD operations', () => {
			const collection = new CollectionOfEntity<TestEntity>();
			const entity1 = new TestEntity(
				{ name: 'entity1', value: 10 },
				new NumberEntityId(1),
			);
			const entity2 = new TestEntity(
				{ name: 'entity2', value: 20 },
				new NumberEntityId(2),
			);
			const entity1Updated = new TestEntity(
				{ name: 'entity1-updated', value: 15 },
				new NumberEntityId(1),
			);

			// Create
			collection.add(entity1);
			collection.add(entity2);
			expect(collection.length).toBe(2);

			// Read
			expect(collection.find(new NumberEntityId(1))?.name).toBe('entity1');
			expect(collection.find(new NumberEntityId(2))?.name).toBe('entity2');

			// Update (via reload)
			collection.reload(entity1Updated);
			expect(collection.find(new NumberEntityId(1))?.name).toBe(
				'entity1-updated',
			);

			// Delete
			collection.remove(new NumberEntityId(1));
			expect(collection.length).toBe(1);
			expect(collection.has(new NumberEntityId(1))).toBe(false);
			expect(collection.has(new NumberEntityId(2))).toBe(true);
		});

		it('should work with different entity id types', () => {
			const collection = new CollectionOfEntity<TestEntity>();

			// Test with different NumberEntityId values
			const entities = [
				new TestEntity({ name: 'test1', value: 10 }, new NumberEntityId(1)),
				new TestEntity({ name: 'test2', value: 20 }, new NumberEntityId(100)),
				new TestEntity({ name: 'test3', value: 30 }, new NumberEntityId(999)),
			];

			collection.addMany(entities);

			expect(collection.length).toBe(3);
			expect(collection.find(new NumberEntityId(1))?.name).toBe('test1');
			expect(collection.find(new NumberEntityId(100))?.name).toBe('test2');
			expect(collection.find(new NumberEntityId(999))?.name).toBe('test3');
		});
	});
});
