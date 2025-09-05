import { crc32 } from 'zlib';

import { ApplicationMediatorError } from '@/core/errors/ApplicationMediatorError.js';
import { PreviousError } from '@/core/errors/types/index.js';
import { RuntimeError } from '@/core/errors/RuntimeError.js';
import { DomainError } from '@/core/errors/DomainError.js';
import { Result } from '@/core/Result.js';

import type {
	IApplicationMiddleware,
	IApplicationHandler,
	ApplicationContext,
	IMessage,
} from './types/index.js';

export class ApplicationMediator {
	/**
	 * A map of handlers.
	 *
	 * @type {Map<string, IApplicationHandler>}
	 * @private
	 * @readonly
	 * @memberof ApplicationMediator
	 * @author Caique Araujo <caique@piggly.com.br>
	 * @since 5.0.0
	 */
	private _handlers: Map<string, IApplicationHandler> = new Map();

	/**
	 * Am array of middlewares.
	 *
	 * @type {Array<ApplicationMiddlewareFn>}
	 * @private
	 * @readonly
	 * @memberof ApplicationMediator
	 * @author Caique Araujo <caique@piggly.com.br>
	 * @since 5.0.0
	 */
	private _middlewares: Array<IApplicationMiddleware> = [];

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
		this._middlewares.length = 0;
	}

	/**
	 * Check if a handler is registered.
	 *
	 * @param {IApplicationHandler | string} name Handler instance or name.
	 * @returns {boolean}
	 * @public
	 * @memberof ApplicationMediator
	 * @since 5.0.0
	 * @author Caique Araujo <caique@piggly.com.br>
	 */
	public has(name: IApplicationHandler | string): boolean {
		if (name && typeof name === 'object' && 'handlerFor' in name) {
			return this._handlers.has(name.handlerFor);
		}

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
	public middleware<Message extends IMessage, Context extends ApplicationContext>(
		middleware: IApplicationMiddleware<Message, Context>,
	): ApplicationMediator {
		this._middlewares.push(middleware);
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
		Message extends IMessage,
		Context extends ApplicationContext,
		Response = any,
	>(handler: IApplicationHandler<Message, Context, Response>): ApplicationMediator {
		this._handlers.set(handler.handlerFor, handler);
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
		Message extends IMessage,
		Context extends ApplicationContext,
		Response = any,
	>(message: Message, context?: Context): Promise<Result<Response, DomainError>> {
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

			const executeHandler = async (): Promise<Result<Response, DomainError>> => {
				try {
					return await handler.handle(message, context);
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
				() => Promise<Result<Response, DomainError>>
			>((next, middleware) => {
				return async (): Promise<Result<Response, DomainError>> => {
					try {
						return await middleware.apply(message, context, next);
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
