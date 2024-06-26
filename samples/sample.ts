import { ValueObject, Result, DomainError } from '../src';

class CustomValueObject extends ValueObject {
	private constructor(number: number) {
		super({ number });
	}

	public get number(): number {
		return this.props.number;
	}

	public static create(number: number): Result<CustomValueObject, DomainError> {
		if (number < 0) {
			return Result.fail(
				new DomainError('Number', 10, 'Number must be greater than 0')
			);
		}

		return Result.ok(new CustomValueObject(number));
	}
}

const vo = CustomValueObject.create(-1);

if (vo.isFailure) {
	console.log(vo.error);
}

if (vo.isSuccess) {
	console.log(vo.data);
}
