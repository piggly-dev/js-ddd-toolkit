import Service from './Service';
import UnitOfWork from './UnitOfWork';

/**
 * @file Application Service abstraction.
 * @copyright Piggly Lab 2023
 */
export default abstract class ApplicationService extends Service {
	/**
	 * UnitOfWork with repositories.
	 *
	 * @type {UnitOfWork}
	 * @protected
	 * @memberof Service
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	protected _unitofwork: UnitOfWork;

	/**
	 * Constructor.
	 *
	 * @param {UnitOfWork} unitofwork
	 * @public
	 * @constructor
	 * @memberof Service
	 * @since 1.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	constructor(unitofwork: UnitOfWork) {
		super();
		this._unitofwork = unitofwork;
	}
}
