import type { IUnitOfWork } from '@/core/repositories/types/index.js';

import { AbstractRelationalRepository } from '@/core/repositories/AbstractRelationalRepository.js';
import { DomainError } from '@/core/errors/DomainError.js';
import { Result } from '@/core/Result.js';

import type { InMemoryContext, InMemoryDriver } from './InMemoryDriver';

/**
 * Simple User entity for testing.
 */
export interface User {
	version: number;
	email: string;
	name: string;
	id: string;
}

/**
 * Example in-memory repository implementation for testing.
 */
export class InMemoryUserRepository extends AbstractRelationalRepository<
	InMemoryDriver,
	'inmemory',
	InMemoryContext
> {
	protected readonly COLLECTION_NAME = 'users';

	/**
	 * Clone the repository with a specific UoW.
	 */
	public clone(uow?: IUnitOfWork<'inmemory', InMemoryContext>): this {
		return new InMemoryUserRepository(this._name, this._driver, uow) as this;
	}

	/**
	 * Count all users.
	 */
	public async count(): Promise<Result<number, DomainError>> {
		try {
			const context = this.context();
			if (!context) {
				return Result.fail(
					new DomainError('NO_CONTEXT', 500, 'No active context'),
				);
			}

			const collection = context.db.getCollection(this.COLLECTION_NAME);
			return Result.ok(collection.size);
		} catch (error) {
			return Result.fail(
				new DomainError(
					'COUNT_ERROR',
					500,
					'Failed to count users',
					undefined,
					undefined,
					{
						error,
					},
				),
			);
		}
	}

	/**
	 * Delete a user by ID.
	 */
	public async delete(id: string): Promise<Result<boolean, DomainError>> {
		try {
			const context = this.context();
			if (!context) {
				return Result.fail(
					new DomainError('NO_CONTEXT', 500, 'No active context'),
				);
			}

			const collection = context.db.getCollection(this.COLLECTION_NAME);
			const deleted = collection.delete(id);

			return Result.ok(deleted);
		} catch (error) {
			return Result.fail(
				new DomainError(
					'DELETE_ERROR',
					500,
					'Failed to delete user',
					undefined,
					undefined,
					{ error },
				),
			);
		}
	}

	/**
	 * Check if a user exists by ID.
	 */
	public async exists(id: string): Promise<Result<boolean, DomainError>> {
		try {
			const context = this.context();
			if (!context) {
				return Result.fail(
					new DomainError('NO_CONTEXT', 500, 'No active context'),
				);
			}

			const collection = context.db.getCollection(this.COLLECTION_NAME);
			return Result.ok(collection.has(id));
		} catch (error) {
			return Result.fail(
				new DomainError(
					'EXISTS_ERROR',
					500,
					'Failed to check existence',
					undefined,
					undefined,
					{ error },
				),
			);
		}
	}

	/**
	 * Find all users.
	 */
	public async findAll(): Promise<Result<User[], DomainError>> {
		try {
			const context = this.context();
			if (!context) {
				return Result.fail(
					new DomainError('NO_CONTEXT', 500, 'No active context'),
				);
			}

			const collection = context.db.getCollection(this.COLLECTION_NAME);
			const users = Array.from(collection.values()) as User[];

			return Result.ok(users);
		} catch (error) {
			return Result.fail(
				new DomainError(
					'FIND_ERROR',
					500,
					'Failed to find users',
					undefined,
					undefined,
					{
						error,
					},
				),
			);
		}
	}

	/**
	 * Find a user by ID.
	 */
	public async findById(id: string): Promise<Result<User | null, DomainError>> {
		try {
			const context = this.context();
			if (!context) {
				return Result.fail(
					new DomainError('NO_CONTEXT', 500, 'No active context'),
				);
			}

			const collection = context.db.getCollection(this.COLLECTION_NAME);
			const user = collection.get(id) as undefined | User;

			return Result.ok(user || null);
		} catch (error) {
			return Result.fail(
				new DomainError(
					'FIND_ERROR',
					500,
					'Failed to find user',
					undefined,
					undefined,
					{
						error,
					},
				),
			);
		}
	}

	/**
	 * Save a user (insert or update).
	 */
	public async save(user: User): Promise<Result<void, DomainError>> {
		try {
			const context = this.context();
			if (!context) {
				return Result.fail(
					new DomainError('NO_CONTEXT', 500, 'No active context'),
				);
			}

			const collection = context.db.getCollection(this.COLLECTION_NAME);
			const existing = collection.get(user.id) as undefined | User;

			// Optimistic locking check
			if (existing && existing.version !== user.version) {
				return Result.fail(
					new DomainError(
						'OPTIMISTIC_LOCK_ERROR',
						409,
						'Concurrent modification detected',
						undefined,
						undefined,
						{ actual: existing.version, expected: user.version },
					),
				);
			}

			// Increment version on save
			const updatedUser = { ...user, version: user.version + 1 };
			collection.set(user.id, updatedUser);

			return Result.ok(undefined);
		} catch (error) {
			return Result.fail(
				new DomainError(
					'SAVE_ERROR',
					500,
					'Failed to save user',
					undefined,
					undefined,
					{
						error,
					},
				),
			);
		}
	}
}
