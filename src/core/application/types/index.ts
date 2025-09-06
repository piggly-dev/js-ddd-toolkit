import type { DomainError } from '@/core/errors/DomainError.js';
import type { Result } from '@/core/Result.js';

export interface ApplicationContext<T = Record<string, any>> {
	metadata?: Record<string, any>;
	data: T;
}

export interface IApplicationHandler<
	Message extends IMessage = IMessage,
	Context extends ApplicationContext = ApplicationContext,
	Response = any,
> {
	handle(
		command: Message,
		context?: Context,
	): Promise<Result<Response, DomainError>>;
	get handlerFor(): string;
}

export interface IApplicationMiddleware<
	Message extends IMessage = IMessage,
	Context extends ApplicationContext = ApplicationContext,
	Response = any,
> {
	apply(
		command: Message,
		context?: Context,
		next?: () => Promise<Result<Response, DomainError>>,
	): Promise<Result<Response, DomainError>>;
}

export interface IMessage {
	commandName: string;
}
