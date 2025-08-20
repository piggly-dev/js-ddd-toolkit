import { EntityIdMismatchError } from '@/core/errors/EntityIdMismatchError.js';
import { NumberEntityId } from '@/core/entities/ids/NumberEntityId.js';
import { OptionalEntity } from '@/core/entities/OptionalEntity.js';
import { Entity } from '@/core/entities/Entity.js';

class ConcreteEntity extends Entity<{ a: number }, NumberEntityId> {
	public get a(): number {
		return this._props.a;
	}

	protected generateId() {
		return new NumberEntityId();
	}
}

describe('OptionalEntity', () => {
	it('should create an optional entity', () => {
		const id = new NumberEntityId(10);
		const entity = new ConcreteEntity({ a: 10 }, id);

		const optional = new OptionalEntity(id, entity);

		expect(optional.id.equals(id)).toBe(true);
		expect(optional.entity).toBe(entity);
		expect(optional.isPresent()).toBe(true);
		expect(optional.isAbsent()).toBe(false);
		expect(optional.knowableEntity).toBe(entity);
		expect(() => optional.knowableEntity).not.toThrow();
	});

	it('should load an entity', () => {
		const id = new NumberEntityId(10);
		const entity = new ConcreteEntity({ a: 10 }, id);
		const another = new ConcreteEntity({ a: 12 }, id);

		const optional = new OptionalEntity(id, entity);
		optional.load(another);

		expect(optional.id.equals(id)).toBe(true);
		expect(optional.knowableEntity.a).toBe(12);
	});

	it('should fail to load an entity with a different id', () => {
		const id = new NumberEntityId(10);
		const entity = new ConcreteEntity({ a: 10 }, id);
		const another = new ConcreteEntity({ a: 12 }, new NumberEntityId(11));

		const optional = new OptionalEntity(id, entity);
		expect(() => optional.load(another)).toThrow('Entity ID does not match.');
	});

	it('should safe load an entity', () => {
		const id = new NumberEntityId(10);
		const entity = new ConcreteEntity({ a: 10 }, id);
		const another = new ConcreteEntity({ a: 12 }, id);

		const optional = new OptionalEntity(id, entity);
		optional.load(another);

		expect(optional.id.equals(id)).toBe(true);
		expect(optional.knowableEntity.a).toBe(12);
		expect(optional.safeLoad(another).isSuccess).toBe(true);
		expect(optional.safeLoad(another).data.a).toBe(12);
	});

	it('should fail when safe load an entity with a different id', () => {
		const id = new NumberEntityId(10);
		const entity = new ConcreteEntity({ a: 10 }, id);
		const another = new ConcreteEntity({ a: 12 }, new NumberEntityId(11));

		const optional = new OptionalEntity(id, entity);
		expect(optional.safeLoad(another).isFailure).toBe(true);
		expect(optional.safeLoad(another).error).toBeInstanceOf(EntityIdMismatchError);
	});
});
