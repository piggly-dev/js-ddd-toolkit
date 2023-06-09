import Service from './Service';
import UnitOfWork from './UnitOfWork';

/**
 * @file Domain Service abstraction.
 * @copyright Piggly Lab 2023
 */
export default abstract class DomainService<
	UoW extends UnitOfWork<any>
> extends Service {
	/**
	 * UnitOfWork with repositories.
	 *
	 * @type {UoW}
	 * @protected
	 * @memberof Service
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _unitofwork: UoW;

	/**
	 * Constructor.
	 *
	 * @param {UoW} unitofwork
	 * @public
	 * @constructor
	 * @memberof Service
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(unitofwork: UoW) {
		super();
		this._unitofwork = unitofwork;
	}
}
