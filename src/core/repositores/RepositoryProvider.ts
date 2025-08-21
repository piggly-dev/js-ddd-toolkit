import { RepositoryBundle } from '@/core/repositores/RepositoryBundle.js';
import { IRepository } from '@/core/repositores/types/index.js';
/**
 * @file A repository provider to register and resolve repositories.
 * @copyright Piggly Lab 2025
 */
export class RepositoryProvider {
	/**
	 * Map of registered repositories.
	 *
	 * @type {Map<string, IRepository<any>>}
	 * @private
	 * @static
	 * @memberof RepositoryProvider
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	private static _repositories: Map<string, IRepository<any>> = new Map();

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
	 * @param {string} name
	 * @param {RepositoryInstance} instance
	 * @returns {void}
	 * @public
	 * @static
	 * @throws {Error} If repository is already registered.
	 * @memberof RepositoryProvider
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static register<Repository extends IRepository<any>>(
		instance: Repository,
	): void {
		if (this._repositories.has(instance.name)) {
			throw new Error(`Repository "${instance.name}" already registered.`);
		}

		this._repositories.set(instance.name, instance);
	}

	/**
	 * Resolve a bundle of repositories.
	 *
	 * @param {string[]} names
	 * @returns {RepositoryBundle}
	 * @public
	 * @static
	 * @memberof RepositoryProvider
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static resolve(...names: string[]): RepositoryBundle {
		if (names.length === 0) {
			throw new Error('You must to provide at least one repository name.');
		}

		const repositories = [];

		for (const name of names) {
			const repository = this._repositories.get(name);

			if (repository === undefined) {
				throw new Error(`Repository "${name}" not found.`);
			}

			repositories.push(repository);
		}

		for (const repository of repositories) {
			if (repositories[0].isCompatibleWith(repository) === false) {
				throw new Error(
					`You must to provide compatible repositories. The repository "${repository.name}" is not compatible with "${repositories[0].name}".`,
				);
			}
		}

		const bundle = new RepositoryBundle(repositories[0].buildUnitOfWork());

		for (const repository of repositories) {
			bundle.add(repository);
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
