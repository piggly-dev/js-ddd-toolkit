import { IRepository, IUnitOfWork } from '@/core/repositores/types/index.js';

/**
 * @file A bundle of repositories.
 * @copyright Piggly Lab 2025
 */
export class RepositoryBundle {
	/**
	 * Map of registered repositories.
	 *
	 * @type {Map<string, IRepository<any>>}
	 * @protected
	 * @static
	 * @memberof RepositoryProvider
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _repositories: Map<string, IRepository<any>> = new Map();

	/**
	 * The context associated with the bundle.
	 *
	 * @type {IUnitOfWork<any, any>}
	 * @protected
	 * @memberof RepositoryBundle
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _uow: IUnitOfWork<any, any>;

	/**
	 * Create a new repository bundle.
	 *
	 * @param {IUnitOfWork<any, any>} uow
	 * @constructor
	 * @memberof RepositoryBundle
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public constructor(uow: IUnitOfWork<any, any>) {
		this._uow = uow;
	}

	/**
	 * Get the UoW associated with the bundle.
	 *
	 * @returns {IUnitOfWork<any, any> | undefined}
	 * @public
	 * @memberof RepositoryBundle
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get uow(): IUnitOfWork<any, any> {
		return this._uow;
	}

	/**
	 * Add a repository to the bundle.
	 *
	 * @param {IRepository<any>} repository
	 * @returns {this}
	 * @public
	 * @throws {Error} If repository is already registered.
	 * @memberof RepositoryBundle
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public add(repository: IRepository<any>): this {
		this._repositories.set(repository.name, repository.clone(this._uow));
		return this;
	}

	/**
	 * Get a repository from the bundle.
	 *
	 * @param {string} name
	 * @returns {IRepository<any>}
	 * @public
	 * @throws {Error} If repository is not found.
	 * @memberof RepositoryBundle
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get<Repository extends IRepository<any>>(name: string): Repository {
		const repository = this._repositories.get(name);

		if (repository === undefined) {
			throw new Error(`Repository "${name}" not found.`);
		}

		return repository as Repository;
	}
}
