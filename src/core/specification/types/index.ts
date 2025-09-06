import type { DomainError } from '@/core/errors/DomainError.js';
import type { Result } from '@/core/Result.js';

/**
 * @description Specification interface.
 * @since 5.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export interface ISpecification<Candidate> {
	check(candidate: Candidate, message?: string): Result<void, DomainError>;
	and(other: ISpecification<Candidate>): ISpecification<Candidate>;
	or(other: ISpecification<Candidate>): ISpecification<Candidate>;
	isSatisfiedBy(candidate: Candidate): boolean;
	explainWhy(candidate: Candidate): string;
	not(): ISpecification<Candidate>;
}
