import {
	EntityIdMismatchError,
	OptionalEntity,
	NumberEntityId,
	Entity,
} from '@/index';

interface TestProps {
	value: number;
	name: string;
}

class TestEntity extends Entity<TestProps, NumberEntityId> {
	get name() {
		return this._props.name;
	}

	get value() {
		return this._props.value;
	}

	public clone(): this {
		return new TestEntity({ ...this._props }, this.id) as this;
	}

	updateName(name: string) {
		this._props.name = name;
	}

	protected generateId() {
		return new NumberEntityId();
	}
}

describe('OptionalEntity', () => {
	describe('constructor and basic properties', () => {
		it('should create with entity present', () => {
			const id = new NumberEntityId(10);
			const entity = new TestEntity({ name: 'test', value: 42 }, id);
			const optional = new OptionalEntity(id, entity);

			expect(optional.id.equals(id)).toBe(true);
			expect(optional.entity).toBe(entity);
			expect(optional.isPresent()).toBe(true);
			expect(optional.isAbsent()).toBe(false);
			expect(optional.knowableEntity).toBe(entity);
		});

		it('should create with no entity (absent)', () => {
			const id = new NumberEntityId(10);
			const optional = new OptionalEntity<TestEntity, NumberEntityId>(id);

			expect(optional.id.equals(id)).toBe(true);
			expect(optional.entity).toBeUndefined();
			expect(optional.isPresent()).toBe(false);
			expect(optional.isAbsent()).toBe(true);
		});

		it('should throw when accessing knowableEntity when absent', () => {
			const id = new NumberEntityId(10);
			const optional = new OptionalEntity<TestEntity, NumberEntityId>(id);

			expect(() => optional.knowableEntity).toThrow('Entity is not present');
		});
	});

	describe('load operations', () => {
		it('should load entity with matching id', () => {
			const id = new NumberEntityId(10);
			const entity1 = new TestEntity({ name: 'first', value: 10 }, id);
			const entity2 = new TestEntity({ name: 'second', value: 20 }, id);

			const optional = new OptionalEntity(id, entity1);
			expect(optional.knowableEntity.name).toBe('first');

			optional.load(entity2);
			expect(optional.knowableEntity.name).toBe('second');
			expect(optional.knowableEntity.value).toBe(20);
		});

		it('should load entity when initially absent', () => {
			const id = new NumberEntityId(10);
			const entity = new TestEntity({ name: 'loaded', value: 42 }, id);

			const optional = new OptionalEntity<TestEntity, NumberEntityId>(id);
			expect(optional.isAbsent()).toBe(true);

			optional.load(entity);
			expect(optional.isPresent()).toBe(true);
			expect(optional.knowableEntity).toBe(entity);
		});

		it('should throw when loading entity with mismatched id', () => {
			const id1 = new NumberEntityId(10);
			const id2 = new NumberEntityId(20);
			const entity1 = new TestEntity({ name: 'first', value: 10 }, id1);
			const entity2 = new TestEntity({ name: 'second', value: 20 }, id2);

			const optional = new OptionalEntity(id1, entity1);

			expect(() => optional.load(entity2)).toThrow('Entity ID does not match.');
		});
	});

	describe('safeLoad operations', () => {
		it('should safely load entity with matching id', () => {
			const id = new NumberEntityId(10);
			const entity1 = new TestEntity({ name: 'first', value: 10 }, id);
			const entity2 = new TestEntity({ name: 'second', value: 20 }, id);

			const optional = new OptionalEntity(id, entity1);
			const result = optional.safeLoad(entity2);

			expect(result.isSuccess).toBe(true);
			expect(result.data).toBe(entity2);
			expect(optional.knowableEntity).toBe(entity2);
		});

		it('should return failure when loading entity with mismatched id', () => {
			const id1 = new NumberEntityId(10);
			const id2 = new NumberEntityId(20);
			const entity1 = new TestEntity({ name: 'first', value: 10 }, id1);
			const entity2 = new TestEntity({ name: 'second', value: 20 }, id2);

			const optional = new OptionalEntity(id1, entity1);
			const result = optional.safeLoad(entity2);

			expect(result.isFailure).toBe(true);
			expect(result.error).toBeInstanceOf(EntityIdMismatchError);
			expect(optional.knowableEntity).toBe(entity1); // Should not change
		});

		it('should safely load when initially absent', () => {
			const id = new NumberEntityId(10);
			const entity = new TestEntity({ name: 'loaded', value: 42 }, id);

			const optional = new OptionalEntity<TestEntity, NumberEntityId>(id);
			const result = optional.safeLoad(entity);

			expect(result.isSuccess).toBe(true);
			expect(result.data).toBe(entity);
			expect(optional.isPresent()).toBe(true);
		});
	});

	describe('entity replacement scenarios', () => {
		it('should replace entity multiple times', () => {
			const id = new NumberEntityId(10);
			const entities = [
				new TestEntity({ name: 'first', value: 10 }, id),
				new TestEntity({ name: 'second', value: 20 }, id),
				new TestEntity({ name: 'third', value: 30 }, id),
			];

			const optional = new OptionalEntity(id);

			entities.forEach((entity, index) => {
				optional.load(entity);
				const loadedEntity = optional.knowableEntity;
				expect(loadedEntity).toBeDefined();
				expect(loadedEntity.equals(entity)).toBe(true);
			});
		});

		it('should handle load-replace-load cycle', () => {
			const id = new NumberEntityId(10);
			const entity1 = new TestEntity({ name: 'first', value: 10 }, id);
			const entity2 = new TestEntity({ name: 'second', value: 20 }, id);

			const optional = new OptionalEntity(id, entity1);
			expect(optional.knowableEntity.name).toBe('first');

			// Replace with new entity
			optional.load(entity2);
			expect(optional.knowableEntity.name).toBe('second');
		});
	});

	describe('error handling', () => {
		it('should provide detailed error for id mismatch', () => {
			const id1 = new NumberEntityId(10);
			const id2 = new NumberEntityId(20);
			const entity1 = new TestEntity({ name: 'entity1', value: 10 }, id1);
			const entity2 = new TestEntity({ name: 'entity2', value: 20 }, id2);

			const optional = new OptionalEntity(id1, entity1);

			try {
				optional.load(entity2);
				fail('Should have thrown');
			} catch (error) {
				expect(error).toBeInstanceOf(Error);
				if (error instanceof Error) {
					expect(error.message).toBe('Entity ID does not match.');
				}
			}
		});

		it('should handle safeLoad error details', () => {
			const id1 = new NumberEntityId(10);
			const id2 = new NumberEntityId(20);
			const entity = new TestEntity({ name: 'test', value: 10 }, id2);

			const optional = new OptionalEntity<TestEntity, NumberEntityId>(id1);
			const result = optional.safeLoad(entity);

			expect(result.isFailure).toBe(true);
			expect(result.error).toBeInstanceOf(EntityIdMismatchError);
			expect(result.error.message).toContain('Entity ID mismatch.');
		});
	});

	describe('integration tests', () => {
		it('should work with entity updates', () => {
			const id = new NumberEntityId(10);
			const entity = new TestEntity({ name: 'original', value: 42 }, id);

			const optional = new OptionalEntity(id, entity);

			// Update the entity
			optional.knowableEntity.updateName('updated');
			expect(optional.knowableEntity.name).toBe('updated');

			// The same entity reference is maintained
			expect(optional.entity).toBe(entity);
			expect(entity.name).toBe('updated');
		});

		it('should handle complex entity lifecycle', () => {
			const id = new NumberEntityId(42);
			const log: string[] = [];

			const optional = new OptionalEntity<TestEntity, NumberEntityId>(id);

			// Start absent
			if (optional.isAbsent()) {
				log.push('Started absent');
			}

			// Load first entity
			const entity1 = new TestEntity({ name: 'entity1', value: 100 }, id);
			optional.load(entity1);
			if (optional.isPresent()) {
				log.push(`Loaded: ${optional.knowableEntity.name}`);
			}

			// Try to load mismatched entity
			const mismatchedEntity = new TestEntity(
				{ name: 'mismatched', value: 200 },
				new NumberEntityId(99),
			);
			const result = optional.safeLoad(mismatchedEntity);
			if (result.isFailure) {
				log.push('Failed to load mismatched entity');
			}

			// Replace with new entity
			const entity2 = new TestEntity({ name: 'entity2', value: 150 }, id);
			optional.load(entity2);
			log.push(`Replaced with: ${optional.knowableEntity.name}`);

			// Entity remains present (no unload method available)
			if (optional.isPresent()) {
				log.push('Entity remains present');
			}

			expect(log).toEqual([
				'Started absent',
				'Loaded: entity1',
				'Failed to load mismatched entity',
				'Replaced with: entity2',
				'Entity remains present',
			]);
		});

		it('should work with collections', () => {
			const ids = [1, 2, 3, 4, 5].map(i => new NumberEntityId(i));
			const optionals = ids.map(
				id => new OptionalEntity<TestEntity, NumberEntityId>(id),
			);

			// Load some entities
			optionals[0].load(new TestEntity({ name: 'entity1', value: 10 }, ids[0]));
			optionals[2].load(new TestEntity({ name: 'entity3', value: 30 }, ids[2]));
			optionals[4].load(new TestEntity({ name: 'entity5', value: 50 }, ids[4]));

			// Count present entities
			const presentCount = optionals.filter(opt => opt.isPresent()).length;
			expect(presentCount).toBe(3);

			// Get all present entity names
			const names = optionals
				.filter(opt => opt.isPresent())
				.map(opt => opt.knowableEntity.name);
			expect(names).toEqual(['entity1', 'entity3', 'entity5']);

			// Get total value of present entities
			const totalValue = optionals
				.filter(opt => opt.isPresent())
				.reduce((sum, opt) => sum + opt.knowableEntity.value, 0);
			expect(totalValue).toBe(90);
		});
	});
});
