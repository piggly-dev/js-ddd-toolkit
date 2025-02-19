import { ValueObject, ResultChain, Result, DomainError } from '../src';

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

const isEven = (number: number): Result<true, DomainError> => {
	if (number % 2 === 0) {
		return Result.ok(true);
	}

	return Result.fail(new DomainError('Number', 10, 'Number must be even'));
};

const asyncIsEven = async (number: number): Promise<Result<true, DomainError>> =>
	new Promise(resolve => {
		setTimeout(() => {
			if (number % 2 === 0) {
				resolve(Result.ok(true));
			}

			resolve(Result.fail(new DomainError('Number', 10, 'Number must be even')));
		}, 1000);
	});

const results = new ResultChain();

results
	.begin()
	.chain<false, true>('isEven', _last => isEven(2))
	.chain<true, true>('asyncIsEven', async last => asyncIsEven(3))
	.chain<true, CustomValueObject>('voData', last => CustomValueObject.create(2))
	.run<CustomValueObject>()
	.then(r => {
		if (r.isFailure) {
			console.log(results.resultFor('isEven'));
			console.log(results.resultFor('asyncIsEven'));
			console.log(results.resultFor('voData'));

			console.error(r.error);
			return;
		}

		console.log(results.resultFor('isEven'));
		console.log(results.resultFor('asyncIsEven'));
		console.log(results.resultFor('voData'));

		console.log(r.data);
	})
	.catch(err => {
		console.error(err);
	});
