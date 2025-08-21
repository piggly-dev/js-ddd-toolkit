import type { IRepository, IUnitOfWork } from '@/core/repositories/types/index.js';

/**
 * @file A bundle of repositories.
 * @copyright Piggly Lab 2025
 */
export class RelationalRepositoryBundle<
	Engine extends string = string,
	Context = unknown,
> {
	/**
	 * Map of registered repositories.
	 *
	 * @type {Map<string, IRepository<Engine, Context>>}
	 * @protected
	 * @memberof RelationalRepositoryBundle
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _repositories: Map<string, IRepository<Engine, Context>> = new Map();

	/**
	 * The Unit of Work associated with the bundle.
	 *
	 * @type {IUnitOfWork<Engine, Context>}
	 * @protected
	 * @memberof RelationalRepositoryBundle
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _uow: IUnitOfWork<Engine, Context>;

	/**
	 * Create a new repository bundle.
	 *
	 * @param {IUnitOfWork<Engine, Context>} uow
	 * @constructor
	 * @memberof RelationalRepositoryBundle
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public constructor(uow: IUnitOfWork<Engine, Context>) {
		this._uow = uow;
	}

	/**
	 * Get the UoW associated with the bundle.
	 *
	 * @returns {IUnitOfWork<Engine, Context>}
	 * @public
	 * @memberof RelationalRepositoryBundle
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get uow(): IUnitOfWork<Engine, Context> {
		return this._uow;
	}

	/**
	 * Add a repository to the bundle.
	 *
	 * @param {IRepository<Engine, Context>} repository
	 * @returns {this}
	 * @public
	 * @throws {Error} If repository is already registered.
	 * @memberof RelationalRepositoryBundle
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public add(repository: IRepository<Engine, Context>): this {
		this._repositories.set(repository.name, repository.clone(this._uow));
		return this;
	}

	/**
	 * Dispose the bundle and its UoW.
	 * Calls end() on the UoW and clears all repositories.
	 *
	 * @returns {Promise<void>}
	 * @public
	 * @memberof RelationalRepositoryBundle
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public async dispose(): Promise<void> {
		await this._uow.end();
		this._repositories.clear();
	}

	/**
	 * Get a repository from the bundle.
	 * Ensures the UoW is active before returning the repository.
	 *
	 * @param {string} name
	 * @returns {Repository}
	 * @public
	 * @throws {Error} If repository is not found or UoW is not active.
	 * @memberof RelationalRepositoryBundle
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get<Repository extends IRepository<Engine, Context>>(
		name: string,
	): Repository {
		if (!this._uow.isActive()) {
			throw new Error('Unit of Work is not active. Call begin() first.');
		}

		const repository = this._repositories.get(name);

		if (repository === undefined) {
			throw new Error(`Repository "${name}" not found.`);
		}

		return repository as Repository;
	}

	/**
	 * Support for async disposal pattern.
	 *
	 * @returns {Promise<void>}
	 * @public
	 * @memberof RelationalRepositoryBundle
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public async [Symbol.asyncDispose](): Promise<void> {
		return this.dispose();
	}
}
