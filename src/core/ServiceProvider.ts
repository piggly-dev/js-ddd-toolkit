/**
 * @file A service provider to register and resolve services.
 * @copyright Piggly Lab 2023
 */
export class ServiceProvider {
	/**
	 * Services registered.
	 *
	 * @type {Map<string, any>}
	 * @private
	 * @static
	 * @memberof ServiceProvider
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	private static _services: Map<string, any> = new Map();

	/**
	 * Clear all services.
	 *
	 * @returns {void}
	 * @public
	 * @static
	 * @memberof ServiceProvider
	 * @since 2.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static clear(): void {
		this._services.clear();
	}

	/**
	 * Get a service.
	 *
	 * @param {string} name
	 * @returns {ServiceInstance|undefined}
	 * @public
	 * @static
	 * @memberof ServiceProvider
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static get<ServiceInstance = any>(
		name: string,
	): ServiceInstance | undefined {
		if (this._services.has(name) === false) {
			return undefined;
		}

		return this._services.get(name) as ServiceInstance;
	}

	/**
	 * Check if has a service.
	 *
	 * @param {string} name
	 * @returns {boolean}
	 * @public
	 * @static
	 * @memberof ServiceProvider
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static has(name: string): boolean {
		return this._services.has(name);
	}

	/**
	 * Register a new service.
	 *
	 * @param {string} name
	 * @param {ServiceInstance} instance
	 * @returns {void}
	 * @public
	 * @static
	 * @throws {Error} If service is already registered.
	 * @memberof ServiceProvider
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static register<ServiceInstance = any>(
		name: string,
		instance: ServiceInstance,
	): void {
		if (this._services.has(name)) {
			throw new Error(`Service "${name}" already registered.`);
		}

		this._services.set(name, instance);
	}

	/**
	 * Replaces a service.
	 *
	 * @param {string} name
	 * @param {ServiceInstance} instance
	 * @returns {void}
	 * @public
	 * @static
	 * @memberof ServiceProvider
	 * @since 2.1.2
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static replace<ServiceInstance = any>(
		name: string,
		instance: ServiceInstance,
	): void {
		this.unregister(name);
		this._services.set(name, instance);
	}

	/**
	 * Resolve a service.
	 *
	 * @param {string} name
	 * @returns {ServiceInstance}
	 * @public
	 * @static
	 * @throws {Error} If service is not registered.
	 * @memberof ServiceProvider
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static resolve<ServiceInstance = any>(name: string): ServiceInstance {
		if (this._services.has(name) === false) {
			throw new Error(`Service "${name}" not found.`);
		}

		return this._services.get(name) as ServiceInstance;
	}

	/**
	 * Unregister a service.
	 *
	 * @param {string} name
	 * @returns {boolean}
	 * @public
	 * @static
	 * @memberof ServiceProvider
	 * @since 2.1.2
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public static unregister(name: string): boolean {
		return this._services.delete(name);
	}
}
