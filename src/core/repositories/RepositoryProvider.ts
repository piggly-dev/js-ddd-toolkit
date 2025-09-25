import type { IRepository, IUnitOfWork } from '@/core/repositories/types/index.js';

import { RelationalRepositoryBundle } from '@/core/repositories/RelationalRepositoryBundle.js';

/**
 * @file A repository provider to register and resolve repositories.
 * @copyright Piggly Lab 2025
 */
export class RepositoryProvider {
	/**
	 * Map of registered repositories.
	 * Note: Using any here is intentional as we store different repository types.
	 * Type safety is enforced at retrieval time.
	 *
	 * @type {Map<string, IRepository<any, any>>}
	 * @private
	 * @static
	 * @memberof RepositoryProvider
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	private static _repositories: Map<string, IRepository<any, any>> = new Map();

	/**
	 * Resolve a bundle of repositories.
	 * All repositories must be compatible (same engine and context).
	 * They will share the same UoW (context).
	 *
	 * @param {string[]} names
	 * @returns {RelationalRepositoryBundle<Engine, Context>}
	 * @public
	 * @static
	 * @throws {Error} If repositories are not compatible or not found.
	 * @memberof RepositoryProvider
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static bundleFor<Engine extends string = string, Context = unknown>(
		...names: string[]
	): RelationalRepositoryBundle<Engine, Context> {
		if (names.length === 0) {
			throw new Error('You must to provide at least one repository name.');
		}

		const repositories = [];

		for (const name of names) {
			if (typeof name !== 'string') {
				throw new Error('Repository name must be a string.');
			}

			const repository = this._repositories.get(name);

			if (repository === undefined) {
				throw new Error(`Repository "${name}" not found.`);
			}

			repositories.push(repository);
		}

		return this.unitOfWorkFor(...repositories);
	}

	/**
	 * Clear all repositories.
	 *
	 * @returns {void}
	 * @public
	 * @static
	 * @memberof RepositoryProvider
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static clear(): void {
		this._repositories.clear();
	}

	/**
	 * Get a repository by name.
	 *
	 * @param {string} name
	 * @returns {Repository}
	 * @public
	 * @static
	 * @throws {Error} If repository is not found.
	 * @memberof RepositoryProvider
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static get<Repository extends IRepository<any, any>>(
		name: string,
	): Repository {
		const repository = this._repositories.get(name);

		if (repository === undefined) {
			throw new Error(`Repository "${name}" not found.`);
		}

		return repository as Repository;
	}

	/**
	 * Check if has a repository.
	 *
	 * @param {string} name
	 * @returns {boolean}
	 * @public
	 * @static
	 * @memberof RepositoryProvider
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static has(name: string): boolean {
		return this._repositories.has(name);
	}

	/**
	 * Register a new repository.
	 *
	 * @param {Repository} instance
	 * @returns {void}
	 * @public
	 * @static
	 * @throws {Error} If repository is already registered.
	 * @memberof RepositoryProvider
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static register<
		Engine extends string,
		Context,
		Repository extends IRepository<Engine, Context>,
	>(instance: Repository): void {
		if (this._repositories.has(instance.name)) {
			throw new Error(`Repository "${instance.name}" already registered.`);
		}

		this._repositories.set(instance.name, instance);
	}

	/**
	 * Build a unit of work for a list of repositories.
	 *
	 * @param {IRepository<Engine, Context>[]} repositories
	 * @returns {IUnitOfWork<Engine, Context>}
	 * @public
	 * @static
	 * @memberof RepositoryProvider
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static unitOfWorkFor<Engine extends string = string, Context = unknown>(
		...repositories: Array<IRepository<Engine, Context>>
	): RelationalRepositoryBundle<Engine, Context> {
		if (repositories.length === 0) {
			throw new Error('You must to provide at least one repository.');
		}

		for (let i = 0; i < repositories.length; i++) {
			for (let j = i + 1; j < repositories.length; j++) {
				if (!repositories[i].isCompatibleWith(repositories[j])) {
					throw new Error(
						`Incompatible repositories: "${repositories[i].name}" (engine ${repositories[i].engine}) × "${repositories[j].name}" (engine ${repositories[j].engine}).`,
					);
				}
			}
		}

		const uow = repositories[0].buildUnitOfWork() as IUnitOfWork<Engine, Context>;

		for (const r of repositories) {
			if (uow.engine !== r.engine) {
				throw new Error(
					`UnitOfWork engine mismatch: UoW=${uow.engine} repo("${r.name}")=${r.engine}`,
				);
			}
		}

		const bundle = new RelationalRepositoryBundle<Engine, Context>(uow);

		for (const repository of repositories) {
			bundle.add(repository as IRepository<Engine, Context>);
		}

		return bundle;
	}

	/**
	 * Unregister a repository.
	 *
	 * @param {string} name
	 * @returns {boolean}
	 * @public
	 * @static
	 * @memberof RepositoryProvider
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static unregister(name: string): boolean {
		return this._repositories.delete(name);
	}
}
