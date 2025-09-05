import type { ISpecification } from '@/core/specification/types/index.js';

import { BusinessRuleViolationError } from '@/core/errors/BusinessRuleViolationError.js';
import { DomainError } from '@/core/errors/DomainError.js';
import { Result } from '@/core/Result.js';

/**
 * @description Specification abstract class.
 * @since 5.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export abstract class Specification<Candidate> implements ISpecification<Candidate> {
	/**
	 * Combine two specifications with AND logic.
	 *
	 * @param other Another specification to combine with.
	 * @returns A new specification representing the AND combination.
	 * @public
	 * @memberof Specification
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public and(other: ISpecification<Candidate>): ISpecification<Candidate> {
		return new AndSpecification(this, other);
	}

	/**
	 * Check if a candidate satisfies the specification, returning a Result.
	 *
	 * @param candidate The candidate to be evaluated.
	 * @param message	Optional message for the error if the specification is not satisfied.
	 * @returns	A Result indicating success or failure with a DomainError.
	 * @public
	 * @memberof Specification
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public check(candidate: Candidate, message?: string): Result<void, DomainError> {
		if (this.isSatisfiedBy(candidate)) {
			return Result.okVoid();
		}

		return Result.fail(
			new BusinessRuleViolationError(
				'SpecificationNotSatisfied',
				message ?? 'The candidate does not satisfy the specification.',
			),
		);
	}

	/**
	 * Explain why a candidate does not satisfy the specification.
	 *
	 * @param candidate The candidate to be evaluated.
	 * @returns A string explaining why the candidate does not satisfy the specification.
	 * @public
	 * @memberof Specification
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br
	 */
	public abstract explainWhy(candidate: Candidate): string;

	/**
	 * Check if a candidate satisfies the specification.
	 *
	 * @param candidate The candidate to be evaluated.
	 * @returns True if the candidate satisfies the specification, false otherwise.
	 * @public
	 * @memberof Specification
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public abstract isSatisfiedBy(candidate: Candidate): boolean;

	/**
	 *  Negate the current specification.
	 *
	 * @returns A new specification representing the NOT of the current specification.
	 * @public
	 * @memberof Specification
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public not(): ISpecification<Candidate> {
		return new NotSpecification(this);
	}

	/**
	 * Combine two specifications with OR logic.
	 *
	 * @param other Another specification to combine with.
	 * @returns A new specification representing the OR combination.
	 * @public
	 * @memberof Specification
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public or(other: ISpecification<Candidate>): ISpecification<Candidate> {
		return new OrSpecification(this, other);
	}
}

/**
 * @description AndSpecification class.
 * @since 5.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class AndSpecification<Candidate> extends Specification<Candidate> {
	/**
	 * Left specification.
	 *
	 * @type {ISpecification<Candidate>}
	 * @private
	 * @memberof AndSpecification
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	private left: ISpecification<Candidate>;

	/**
	 * Right specification.
	 *
	 * @type {ISpecification<Candidate>}
	 * @private
	 * @memberof AndSpecification
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	private right: ISpecification<Candidate>;

	/**
	 * Constructor.
	 *
	 * @param left
	 * @param right
	 * @public
	 * @memberof AndSpecification
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public constructor(
		left: ISpecification<Candidate>,
		right: ISpecification<Candidate>,
	) {
		super();

		this.left = left;
		this.right = right;
	}

	/**
	 * Explain why a candidate satisfy (or not) satisfy the AND specification.
	 *
	 * @param candidate The candidate to be evaluated.
	 * @returns A string explaining why the candidate satisfy (or not) the specification.
	 * @public
	 * @memberof AndSpecification
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br
	 */
	public explainWhy(candidate: Candidate): string {
		const l = this.left.explainWhy(candidate);
		const r = this.right.explainWhy(candidate);

		if (
			this.left.isSatisfiedBy(candidate) &&
			this.right.isSatisfiedBy(candidate)
		) {
			return `(${l}) AND (${r}) SATISFIED`;
		}

		if (
			this.left.isSatisfiedBy(candidate) &&
			this.right.isSatisfiedBy(candidate) === false
		) {
			return `(${l}) SATISFIED ONLY`;
		}

		if (
			this.left.isSatisfiedBy(candidate) === false &&
			this.right.isSatisfiedBy(candidate)
		) {
			return `(${r}) SATISFIED ONLY`;
		}

		return 'NONE STATISFIED';
	}

	/**
	 * Check if a candidate satisfies the AND specification.
	 *
	 * @param candidate
	 * @returns True if the candidate satisfies either specification, false otherwise.
	 * @public
	 * @memberof AndSpecification
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public isSatisfiedBy(candidate: Candidate): boolean {
		return (
			this.left.isSatisfiedBy(candidate) && this.right.isSatisfiedBy(candidate)
		);
	}
}

/**
 * @description NotSpecification class.
 * @since 5.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class NotSpecification<Candidate> extends Specification<Candidate> {
	/**
	 * Specification.
	 *
	 * @type {ISpecification<Candidate>}
	 * @private
	 * @memberof NotSpecification
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	private spec: ISpecification<Candidate>;

	/**
	 * Constructor.
	 *
	 * @param spec
	 * @public
	 * @memberof NotSpecification
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public constructor(spec: ISpecification<Candidate>) {
		super();

		this.spec = spec;
	}

	/**
	 * Explain why a candidate satisfy (or not) the NOT specification.
	 *
	 * @param candidate The candidate to be evaluated.
	 * @returns A string explaining why the candidate satisfy (or not) the specification.
	 * @public
	 * @memberof NotSpecification
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br
	 */
	public explainWhy(candidate: Candidate): string {
		if (this.spec.isSatisfiedBy(candidate) === false) {
			return `(NOT ${this.spec.explainWhy(candidate)}) SATISFIED`;
		}

		return `NOT SATISFIED`;
	}

	/**
	 * Check if a candidate satisfies the NOT specification.
	 *
	 * @param candidate
	 * @returns True if the candidate satisfies either specification, false otherwise.
	 * @public
	 * @memberof NotSpecification
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public isSatisfiedBy(candidate: Candidate): boolean {
		return this.spec.isSatisfiedBy(candidate) === false;
	}
}

/**
 * @description AlwaysFalseSpecification class.
 * @since 5.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class AlwaysFalseSpecification<Candidate> extends Specification<Candidate> {
	/**
	 * Explain why a candidate satisfy (or not) specification.
	 *
	 * @param candidate The candidate to be evaluated.
	 * @returns A string explaining why the candidate satisfy (or not) the specification.
	 * @public
	 * @memberof AlwaysFalseSpecification
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br
	 */
	public explainWhy(_: Candidate): string {
		return 'ALWAYS FALSE';
	}

	/**
	 * Always false.
	 *
	 * @param candidate
	 * @returns False always.
	 * @public
	 * @memberof AlwaysFalseSpecification
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public isSatisfiedBy(_: Candidate): boolean {
		return false;
	}
}

/**
 * @description AlwaysTrueSpecification class.
 * @since 5.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class AlwaysTrueSpecification<Candidate> extends Specification<Candidate> {
	/**
	 * Explain why a candidate satisfy (or not) specification.
	 *
	 * @param candidate The candidate to be evaluated.
	 * @returns A string explaining why the candidate satisfy (or not) the specification.
	 * @public
	 * @memberof AlwaysTrueSpecification
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br
	 */
	public explainWhy(_: Candidate): string {
		return 'ALWAYS TRUE';
	}

	/**
	 * Always true.
	 *
	 * @param candidate
	 * @returns True always.
	 * @public
	 * @memberof AlwaysTrueSpecification
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public isSatisfiedBy(_: Candidate): boolean {
		return true;
	}
}

/**
 * @description OrSpecification class.
 * @since 5.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export class OrSpecification<Candidate> extends Specification<Candidate> {
	/**
	 * Left specification.
	 *
	 * @type {ISpecification<Candidate>}
	 * @private
	 * @memberof OrSpecification
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	private left: ISpecification<Candidate>;

	/**
	 * Right specification.
	 *
	 * @type {ISpecification<Candidate>}
	 * @private
	 * @memberof OrSpecification
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	private right: ISpecification<Candidate>;

	/**
	 * Constructor.
	 *
	 * @param left
	 * @param right
	 * @memberof OrSpecification
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public constructor(
		left: ISpecification<Candidate>,
		right: ISpecification<Candidate>,
	) {
		super();

		this.left = left;
		this.right = right;
	}

	/**
	 * Explain why a candidate satisfy (or not) the OR specification.
	 *
	 * @param candidate The candidate to be evaluated.
	 * @returns A string explaining why the candidate satisfy (or not) the specification.
	 * @public
	 * @memberof OrSpecification
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br
	 */
	public explainWhy(candidate: Candidate): string {
		const l = this.left.explainWhy(candidate);
		const r = this.right.explainWhy(candidate);

		if (l || r) {
			return `(${l}) OR (${r}) STATISFIED`;
		}

		return 'NONE SATISFIED';
	}

	/**
	 * Check if a candidate satisfies the OR specification.
	 *
	 * @param candidate
	 * @returns True if the candidate satisfies either specification, false otherwise.
	 * @public
	 * @memberof OrSpecification
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public isSatisfiedBy(candidate: Candidate): boolean {
		return (
			this.left.isSatisfiedBy(candidate) || this.right.isSatisfiedBy(candidate)
		);
	}
}
