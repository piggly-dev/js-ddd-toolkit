import UnitOfWork from './UnitOfWork';

/**
 * @file A unit of work to manage repositories and transactions in database context.
 * @copyright Piggly Lab 2023
 */
export default abstract class Service {
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
		this._unitofwork = unitofwork;
	}
}
