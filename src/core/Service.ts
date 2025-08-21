import { IComponent } from '@/core/types/index.js';

/**
 * @file Service abstraction.
 * @copyright Piggly Lab 2023
 */
export abstract class Service implements IComponent {
	/**
	 * Get the name of the service.
	 *
	 * @returns {string}
	 * @public
	 * @memberof Service
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public get name(): string {
		return this.constructor.name;
	}

	/**
	 * Check if the service is a specific component.
	 *
	 * @param {string} name
	 * @returns {boolean}
	 * @public
	 * @memberof Service
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public is(name: string): boolean {
		return name === this.constructor.name;
	}
}
