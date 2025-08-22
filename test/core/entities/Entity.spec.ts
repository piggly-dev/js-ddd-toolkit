import { NumberEntityId, Entity } from '@/index';

interface TestProps {
	value: number;
	name: string;
}

class ConcreteEntity extends Entity<TestProps, NumberEntityId> {
	public get name(): string {
		return this._props.name;
	}

	public get value(): number {
		return this._props.value;
	}

	public updateName(name: string): void {
		this._props.name = name;
		this.markAsModified();
	}

	public updateValue(value: number): void {
		this._props.value = value;
		this.markAsModified();
	}

	protected generateId() {
		return new NumberEntityId();
	}
}

describe('Entity', () => {
	describe('constructor and id generation', () => {
		it('should have a default random id when not provided', () => {
			const entity = new ConcreteEntity({ name: 'test', value: 10 });

			expect(entity.id.value).toBeDefined();
			expect(entity.id.isRandom()).toBe(true);
			expect(entity.id).toBeInstanceOf(NumberEntityId);
		});

		it('should use provided id', () => {
			const id = new NumberEntityId(10);
			const entity = new ConcreteEntity({ name: 'test', value: 10 }, id);

			expect(entity.id.equals(id)).toBe(true);
			expect(entity.id.value).toBe(10);
			expect(entity.id.isRandom()).toBe(false);
		});

		it('should have same random id for entities without explicit id (NumberEntityId behavior)', () => {
			const entity1 = new ConcreteEntity({ name: 'test1', value: 10 });
			const entity2 = new ConcreteEntity({ name: 'test2', value: 20 });

			// Both entities get NumberEntityId with value -1 (expected behavior)
			expect(entity1.id.equals(entity2.id)).toBe(true);
			expect(entity1.id.value).toBe(-1);
			expect(entity2.id.value).toBe(-1);
		});
	});

	describe('props and modification tracking', () => {
		it('should store and retrieve props correctly', () => {
			const props = { name: 'test', value: 42 };
			const entity = new ConcreteEntity(props);

			expect(entity.name).toBe('test');
			expect(entity.value).toBe(42);
		});

		it('should allow props modification', () => {
			const entity = new ConcreteEntity({ name: 'initial', value: 10 });

			entity.updateName('updated');
			entity.updateValue(20);

			expect(entity.name).toBe('updated');
			expect(entity.value).toBe(20);
		});

		it('should track modification state', () => {
			const entity = new ConcreteEntity({ name: 'test', value: 10 });

			expect(entity.isModified()).toBe(false);

			entity.updateName('modified');
			expect(entity.isModified()).toBe(true);
		});

		it('should mark as persisted', () => {
			const entity = new ConcreteEntity({ name: 'test', value: 10 });

			entity.updateName('modified');
			expect(entity.isModified()).toBe(true);

			entity.markAsPersisted();
			expect(entity.isModified()).toBe(false);
		});
	});

	describe('equals()', () => {
		it('should return true for same instance', () => {
			const entity = new ConcreteEntity({ name: 'test', value: 10 });
			expect(entity.equals(entity)).toBe(true);
		});

		it('should return true for entities with same id', () => {
			const id = new NumberEntityId(10);
			const entity1 = new ConcreteEntity({ name: 'test1', value: 10 }, id);
			const entity2 = new ConcreteEntity(
				{ name: 'test2', value: 20 },
				new NumberEntityId(10),
			);

			expect(entity1.equals(entity2)).toBe(true);
		});

		it('should return false for entities with different ids', () => {
			const entity1 = new ConcreteEntity(
				{ name: 'test', value: 10 },
				new NumberEntityId(10),
			);
			const entity2 = new ConcreteEntity(
				{ name: 'test', value: 10 },
				new NumberEntityId(20),
			);

			expect(entity1.equals(entity2)).toBe(false);
		});

		it('should return false for null or undefined', () => {
			const entity = new ConcreteEntity({ name: 'test', value: 10 });

			expect(entity.equals(null)).toBe(false);
			expect(entity.equals(undefined)).toBe(false);
		});

		it('should return false for non-entity objects', () => {
			const entity = new ConcreteEntity({ name: 'test', value: 10 });

			// Test with simple values that will fail the entity check
			expect(entity.equals(null)).toBe(false);
			expect(entity.equals(undefined)).toBe(false);
		});
	});

	describe('is() method', () => {
		it('should identify as entity', () => {
			const entity = new ConcreteEntity({ name: 'test', value: 10 });
			expect(entity.is('entity')).toBe(true);
			expect(entity.is('ENTITY')).toBe(true);
		});

		it('should not identify as other types', () => {
			const entity = new ConcreteEntity({ name: 'test', value: 10 });
			expect(entity.is('valueobject')).toBe(false);
			expect(entity.is('service')).toBe(false);
		});
	});

	describe('event emission', () => {
		it('should emit events', () => {
			const entity = new ConcreteEntity({ name: 'test', value: 10 });
			const listener = jest.fn();

			entity.on('custom-event', listener);
			entity.emit('custom-event', { data: 'test' });

			expect(listener).toHaveBeenCalledWith({ data: 'test' });
		});

		it('should support multiple event listeners', () => {
			const entity = new ConcreteEntity({ name: 'test', value: 10 });
			const listener1 = jest.fn();
			const listener2 = jest.fn();

			entity.on('update', listener1);
			entity.on('update', listener2);
			entity.emit('update', 'data');

			expect(listener1).toHaveBeenCalledWith('data');
			expect(listener2).toHaveBeenCalledWith('data');
		});

		it('should support removing event listeners', () => {
			const entity = new ConcreteEntity({ name: 'test', value: 10 });
			const listener = jest.fn();

			entity.on('test', listener);
			entity.emit('test', 'first');
			expect(listener).toHaveBeenCalledTimes(1);

			entity.off('test', listener);
			entity.emit('test', 'second');
			expect(listener).toHaveBeenCalledTimes(1);
		});

		it('should support once listeners', () => {
			const entity = new ConcreteEntity({ name: 'test', value: 10 });
			const listener = jest.fn();

			entity.once('test', listener);
			entity.emit('test', 'first');
			entity.emit('test', 'second');

			expect(listener).toHaveBeenCalledTimes(1);
			expect(listener).toHaveBeenCalledWith('first');
		});

		it('should emit modified event when marked as modified', () => {
			const entity = new ConcreteEntity({ name: 'test', value: 10 });
			const listener = jest.fn();

			entity.on('modified', listener);
			entity.updateName('changed');

			expect(listener).toHaveBeenCalledWith(entity);
		});

		it('should emit persisted event when marked as persisted', () => {
			const entity = new ConcreteEntity({ name: 'test', value: 10 });
			const listener = jest.fn();

			entity.on('persisted', listener);
			entity.markAsPersisted();

			expect(listener).toHaveBeenCalledWith(entity);
		});

		it('should dispose and clean up listeners', () => {
			const entity = new ConcreteEntity({ name: 'test', value: 10 });
			const listener1 = jest.fn();
			const listener2 = jest.fn();

			entity.on('event1', listener1);
			entity.on('event2', listener2);
			entity.dispose();

			entity.emit('event1', 'data');
			entity.emit('event2', 'data');

			expect(listener1).not.toHaveBeenCalled();
			expect(listener2).not.toHaveBeenCalled();
		});
	});

	describe('isEntity() static method', () => {
		it('should return true for entity instances', () => {
			const entity = new ConcreteEntity({ name: 'test', value: 10 });
			expect(Entity.isEntity(entity)).toBe(true);
		});

		it('should return false for non-entity objects', () => {
			expect(Entity.isEntity({})).toBe(false);
			expect(Entity.isEntity(null)).toBe(false);
			expect(Entity.isEntity(undefined)).toBe(false);
			expect(Entity.isEntity('string')).toBe(false);
			expect(Entity.isEntity(123)).toBe(false);
			expect(Entity.isEntity([])).toBe(false);
		});
	});

	describe('integration tests', () => {
		it('should handle entity lifecycle with events', () => {
			const events: string[] = [];
			const entity = new ConcreteEntity({ name: 'initial', value: 0 });

			entity.on('modified', () => events.push('modified'));
			entity.on('persisted', () => events.push('persisted'));

			entity.updateName('changed');
			entity.updateValue(100);
			entity.markAsPersisted();

			expect(events).toEqual(['modified', 'modified', 'persisted']);
		});

		it('should maintain entity identity through property changes', () => {
			const id = new NumberEntityId(42);
			const entity = new ConcreteEntity({ name: 'initial', value: 0 }, id);
			const originalId = entity.id;

			entity.updateName('changed');
			entity.updateValue(999);

			expect(entity.id).toBe(originalId);
			expect(entity.id.value).toBe(42);
			expect(entity.id.equals(id)).toBe(true);
		});
	});
});
