import { EntityID, ValueObject } from '@/core';

export class NumberID extends EntityID<number> {
	protected generateRandom(): number {
		return -Math.round(Math.random() * 100);
	}
}

export class CustomValueObject extends ValueObject<{ name: string }> {
	public constructor(name: string) {
		super({ name });
	}

	public get name(): string {
		return this.props.name;
	}
}
