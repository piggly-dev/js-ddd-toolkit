import { crc32 } from 'zlib';

import { ApplicationMediatorError } from '@/core/errors/ApplicationMediatorError.js';
import { PreviousError } from '@/core/errors/types/index.js';
import { RuntimeError } from '@/core/errors/RuntimeError.js';
import { DomainError } from '@/core/errors/DomainError.js';
import { Result } from '@/core/Result.js';

import type {
	ApplicationMiddlewareFn,
	ApplicationHandlerFn,
	ApplicationContext,
	ICommand,
} from './types/index.js';

export class ApplicationMediator {
	/**
	 * A map of handlers.
	 *
	 * @type {Map<string, ApplicationHandlerFn>}
	 * @private
	 * @readonly
	 * @memberof ApplicationMediator
	 * @author Caique Araujo <caique@piggly.com.br>
	 * @since 5.0.0
	 */
	private _handlers: Map<string, ApplicationHandlerFn> = new Map();

	/**
	 * An array of middlewares.
	 *
	 * @type {Array<ApplicationMiddlewareFn>}
	 * @private
	 * @readonly
	 * @memberof ApplicationMediator
	 * @author Caique Araujo <caique@piggly.com.br>
	 * @since 5.0.0
	 */
	private _middlewares: Array<ApplicationMiddlewareFn> = [];

	/**
	 * Clear the mediator.
	 *
	 * @public
	 * @memberof ApplicationMediator
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public clear(): void {
		this._handlers.clear();
		this._middlewares = [];
	}

	/**
	 * Check if a handler is registered.
	 *
	 * @param {string} name Message name.
	 * @returns {boolean}
	 * @public
	 * @memberof ApplicationMediator
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public has(name: string): boolean {
		return this._handlers.has(name);
	}

	/**
	 * Add a middleware to the mediator.
	 *
	 * @param {ApplicationMiddlewareFn<Message, Context>} middleware
	 * @public
	 * @memberof ApplicationMediator
	 * @author Caique Araujo <caique@piggly.com.br>
	 * @since 5.0.0
	 */
	public middleware<
		Message extends ICommand = ICommand,
		Context extends ApplicationContext = ApplicationContext,
	>(middleware: ApplicationMiddlewareFn<Message, Context>): ApplicationMediator {
		this._middlewares.push(middleware as ApplicationMiddlewareFn);
		return this;
	}

	/**
	 * Register a handler.
	 *
	 * @param {string} name Message name.
	 * @param {ApplicationHandlerFn<Message, Context, ResultData>} handler
	 * @public
	 * @memberof ApplicationMediator
	 * @author Caique Araujo <caique@piggly.com.br>
	 * @since 5.0.0
	 */
	public register<
		Message extends ICommand = ICommand,
		Context extends ApplicationContext = ApplicationContext,
		ResultData = any,
	>(
		name: string,
		handler: ApplicationHandlerFn<Message, Context, ResultData>,
	): ApplicationMediator {
		this._handlers.set(name, handler as ApplicationHandlerFn);
		return this;
	}

	/**
	 * Send a message to the mediator.
	 *
	 * @param {Message} message
	 * @param {Context} context
	 * @returns {Promise<Result<ResultData, DomainError>>}
	 * @public
	 * @memberof ApplicationMediator
	 * @author Caique Araujo <caique@piggly.com.br>
	 * @since 5.0.0
	 */
	public async send<
		Message extends ICommand = ICommand,
		Context extends ApplicationContext = ApplicationContext,
		ResultData = any,
	>(message: Message, context?: Context): Promise<Result<ResultData, DomainError>> {
		try {
			const handler = this._handlers.get(message.commandName);

			if (!handler) {
				return Result.fail(
					new ApplicationMediatorError(
						`No handler registered for message: ${message.commandName}`,
						message.commandName,
					),
				);
			}

			const executeHandler = async (): Promise<
				Result<ResultData, DomainError>
			> => {
				try {
					const result = await Promise.resolve(handler(message, context));
					return result as Result<ResultData, DomainError>;
				} catch (error) {
					return Result.fail(
						new ApplicationMediatorError(
							`Handler execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
							message.commandName,
							this._parseError(error),
						),
					);
				}
			};

			const executeWithMiddlewares = this._middlewares.reduceRight<
				() => Promise<Result<ResultData, DomainError>>
			>((next, middleware) => {
				return async (): Promise<Result<ResultData, DomainError>> => {
					try {
						const result = await Promise.resolve(
							middleware(message, context, next),
						);
						return result as Result<ResultData, DomainError>;
					} catch (error) {
						return Result.fail(
							new ApplicationMediatorError(
								`Middleware execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
								message.commandName,
								this._parseError(error),
							),
						);
					}
				};
			}, executeHandler);

			return await executeWithMiddlewares();
		} catch (error) {
			return Result.fail(
				new ApplicationMediatorError(
					`Mediator execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
					message.commandName,
					this._parseError(error),
				),
			);
		}
	}

	/**
	 * Parse an error to a previous error.
	 *
	 * @param {unknown} error
	 * @returns {PreviousError}
	 * @private
	 * @memberof ApplicationMediator
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	private _parseError(error: unknown): PreviousError {
		if (error instanceof Error) {
			return new RuntimeError(
				error.name,
				crc32(error.name),
				error.message,
				500,
				undefined,
				undefined,
				error,
			);
		}

		return error as PreviousError;
	}
}
