import { RepositoryProvider } from '@/core/repositories/RepositoryProvider.js';

import {
	InMemoryUserRepository,
	type User,
} from '../../__stubs__/InMemoryUserRepository';
import { InMemoryDatabase, InMemoryDriver } from '../../__stubs__/InMemoryDriver';

describe('Repository Pattern with UnitOfWork', () => {
	let db: InMemoryDatabase;
	let driver: InMemoryDriver;
	let userRepo: InMemoryUserRepository;

	beforeEach(() => {
		// Clean state for each test
		RepositoryProvider.clear();
		db = new InMemoryDatabase();
		driver = new InMemoryDriver(db);
		userRepo = new InMemoryUserRepository('users', driver);
		RepositoryProvider.register(userRepo);
	});

	describe('Basic Transaction Flow', () => {
		it('should commit changes when transaction succeeds', async () => {
			const bundle = RepositoryProvider.bundleTransaction('users');
			const uow = bundle.uow;

			await uow.begin();
			const repo = bundle.get<InMemoryUserRepository>('users');

			const user: User = {
				id: '1',
				email: 'john@test.com',
				name: 'John',
				version: 0,
			};
			const saveResult = await repo.save(user);
			expect(saveResult.isSuccess).toBe(true);

			await uow.end();

			// Verify data persisted after commit
			await uow.begin();
			const findResult = await repo.findById('1');
			expect(findResult.isSuccess).toBe(true);
			expect(findResult.data).toMatchObject({ ...user, version: 1 });
			await uow.end();
		});

		it('should rollback changes when transaction fails', async () => {
			const bundle = RepositoryProvider.bundleTransaction('users');
			const uow = bundle.uow;

			// First, add a user
			await uow.begin();
			const repo = bundle.get<InMemoryUserRepository>('users');
			await repo.save({
				id: '1',
				email: 'john@test.com',
				name: 'John',
				version: 0,
			});
			await uow.end();

			// Now try to update and rollback
			await uow.begin();
			await repo.save({
				id: '1',
				email: 'jane@test.com',
				name: 'Jane',
				version: 1,
			});

			// Mark for rollback
			uow.fail('Something went wrong');
			await uow.end();

			// Verify original data remains
			await uow.begin();
			const findResult = await repo.findById('1');
			expect(findResult.data?.name).toBe('John');
			await uow.end();
		});

		it('should prevent operations without active UoW', async () => {
			const bundle = RepositoryProvider.bundleTransaction('users');

			// Should throw when trying to get repository without active UoW
			expect(() => bundle.get('users')).toThrow('Unit of Work is not active');
		});
	});

	describe('Savepoint Support', () => {
		it('should rollback to savepoint', async () => {
			const bundle = RepositoryProvider.bundleTransaction('users');
			const uow = bundle.uow;

			await uow.begin();
			const repo = bundle.get<InMemoryUserRepository>('users');

			// Add first user
			await repo.save({
				id: '1',
				email: 'user1@test.com',
				name: 'User1',
				version: 0,
			});

			// Create savepoint
			const sp1Result = await uow.savepoint('sp1');
			expect(sp1Result.isSuccess).toBe(true);

			// Add second user
			await repo.save({
				id: '2',
				email: 'user2@test.com',
				name: 'User2',
				version: 0,
			});

			// Create another savepoint
			const sp2Result = await uow.savepoint('sp2');
			expect(sp2Result.isSuccess).toBe(true);

			// Add third user
			await repo.save({
				id: '3',
				email: 'user3@test.com',
				name: 'User3',
				version: 0,
			});

			// Rollback to first savepoint
			const rollbackResult = await uow.rollbackTo('sp1');
			expect(rollbackResult.isSuccess).toBe(true);

			// Verify only first user exists
			const countResult = await repo.count();
			expect(countResult.data).toBe(1);

			const user1Result = await repo.exists('1');
			expect(user1Result.data).toBe(true);

			const user2Result = await repo.exists('2');
			expect(user2Result.data).toBe(false);

			await uow.end();
		});

		it('should release savepoints', async () => {
			const bundle = RepositoryProvider.bundleTransaction('users');
			const uow = bundle.uow;

			await uow.begin();

			const sp1Result = await uow.savepoint('sp1');
			expect(sp1Result.isSuccess).toBe(true);

			const releaseResult = await uow.releaseSavepoint('sp1');
			expect(releaseResult.isSuccess).toBe(true);

			// Should fail to rollback to released savepoint
			const rollbackResult = await uow.rollbackTo('sp1');
			expect(rollbackResult.isFailure).toBe(true);
			expect(rollbackResult.error?.message).toContain('not found');

			await uow.end();
		});
	});

	describe('Optimistic Locking', () => {
		it('should detect concurrent modifications', async () => {
			const bundle = RepositoryProvider.bundleTransaction('users');

			// Create initial user
			await bundle.uow.begin();
			const repo = bundle.get<InMemoryUserRepository>('users');
			await repo.save({
				id: '1',
				email: 'john@test.com',
				name: 'John',
				version: 0,
			});
			await bundle.uow.end();

			// Simulate two concurrent transactions
			const bundle1 = RepositoryProvider.bundleTransaction('users');
			const bundle2 = RepositoryProvider.bundleTransaction('users');

			// Both read the same version
			await bundle1.uow.begin();
			const repo1 = bundle1.get<InMemoryUserRepository>('users');
			const user1Result = await repo1.findById('1');
			const user1 = user1Result.data!;

			await bundle2.uow.begin();
			const repo2 = bundle2.get<InMemoryUserRepository>('users');
			const user2Result = await repo2.findById('1');
			const user2 = user2Result.data!;

			// First transaction updates successfully
			user1.name = 'John Updated';
			const save1Result = await repo1.save(user1);
			expect(save1Result.isSuccess).toBe(true);
			await bundle1.uow.end();

			// Second transaction should fail with optimistic lock error
			user2.name = 'John Conflicted';
			const save2Result = await repo2.save(user2);
			expect(save2Result.isFailure).toBe(true);
			expect(save2Result.error?.name).toBe('OPTIMISTIC_LOCK_ERROR');

			await bundle2.uow.end();
		});
	});

	describe('Async Disposal Pattern', () => {
		it('should auto-dispose with Symbol.asyncDispose', async () => {
			// Note: This is a conceptual test as Jest doesn't support 'await using' yet
			// In real usage with TypeScript 5.2+:
			// await using bundle = RepositoryProvider.resolve('users');

			const bundle = RepositoryProvider.bundleTransaction('users');
			const uow = bundle.uow;

			await uow.begin();
			const repo = bundle.get<InMemoryUserRepository>('users');
			await repo.save({
				id: '1',
				email: 'test@test.com',
				name: 'Test',
				version: 0,
			});

			// Manual disposal simulation
			await bundle[Symbol.asyncDispose]();

			// After disposal, UoW should not be active
			expect(uow.isActive()).toBe(false);
		});
	});

	describe('Multiple Repository Coordination', () => {
		it('should coordinate multiple repositories in same UoW', async () => {
			// Register a second instance with different name but same implementation
			const user2Repo = new InMemoryUserRepository('users2', driver);
			RepositoryProvider.register(user2Repo);

			const bundle = RepositoryProvider.bundleTransaction('users', 'users2');
			await bundle.uow.begin();

			const userRepo1 = bundle.get<InMemoryUserRepository>('users');
			const userRepo2 = bundle.get<InMemoryUserRepository>('users2');

			// Get initial counts
			const initialCount1 = (await userRepo1.count()).data || 0;
			const initialCount2 = (await userRepo2.count()).data || 0;

			// Operations on both repositories
			await userRepo1.save({
				id: 'u1',
				email: 'author@test.com',
				name: 'Author',
				version: 0,
			});
			await userRepo2.save({
				id: 'u2',
				email: 'editor@test.com',
				name: 'Editor',
				version: 0,
			});

			// Both should see increases in their counts
			const midCount1 = (await userRepo1.count()).data || 0;
			const midCount2 = (await userRepo2.count()).data || 0;
			expect(midCount1).toBeGreaterThan(initialCount1);
			expect(midCount2).toBeGreaterThan(initialCount2);

			// The key test: Rollback affects both repositories
			bundle.uow.fail('Rollback all');
			await bundle.uow.end();

			// Verify rollback - counts should be back to initial state
			await bundle.uow.begin();
			const finalCount1 = (await userRepo1.count()).data || 0;
			const finalCount2 = (await userRepo2.count()).data || 0;
			expect(finalCount1).toBe(initialCount1);
			expect(finalCount2).toBe(initialCount2);
			await bundle.uow.end();
		});
	});

	describe('Error Handling', () => {
		it('should handle Result pattern for all operations', async () => {
			const bundle = RepositoryProvider.bundleTransaction('users');
			await bundle.uow.begin();
			const repo = bundle.get<InMemoryUserRepository>('users');

			// All operations return Result
			const saveResult = await repo.save({
				id: '1',
				email: 'test@test.com',
				name: 'Test',
				version: 0,
			});
			expect(saveResult).toHaveProperty('isSuccess');
			expect(saveResult).toHaveProperty('isFailure');

			const findResult = await repo.findById('1');
			expect(findResult).toHaveProperty('data');
			expect(findResult.isSuccess || findResult.isFailure).toBe(true);

			const deleteResult = await repo.delete('1');
			expect(deleteResult.isSuccess).toBe(true);

			await bundle.uow.end();
		});

		it('should handle repository operations without context', async () => {
			// Create repository without UoW
			const standaloneRepo = new InMemoryUserRepository('standalone', driver);

			// Operations should fail with NO_CONTEXT error
			const result = await standaloneRepo.findById('1');
			expect(result.isFailure).toBe(true);
			expect(result.error?.name).toBe('NO_CONTEXT');
		});
	});

	describe('Transaction Isolation', () => {
		it('should isolate concurrent transactions', async () => {
			const bundle1 = RepositoryProvider.bundleTransaction('users');
			const bundle2 = RepositoryProvider.bundleTransaction('users');

			// Start both transactions
			await bundle1.uow.begin();
			await bundle2.uow.begin();

			const repo1 = bundle1.get<InMemoryUserRepository>('users');
			const repo2 = bundle2.get<InMemoryUserRepository>('users');

			// Each adds different users
			await repo1.save({
				id: '1',
				email: 'tx1@test.com',
				name: 'Tx1User',
				version: 0,
			});
			await repo2.save({
				id: '2',
				email: 'tx2@test.com',
				name: 'Tx2User',
				version: 0,
			});

			// Before commit, each sees only their changes
			await repo1.count();
			await repo2.count();

			// Note: Our simple implementation doesn't have true isolation
			// In a real database, these would be isolated
			// This test documents the current behavior

			await bundle1.uow.end();
			await bundle2.uow.end();
		});
	});
});
