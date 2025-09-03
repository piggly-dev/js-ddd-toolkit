import type { DomainError } from '@/core/errors/DomainError.js';
import type { TOrAnother } from '@/types/index.js';
import type { Result } from '@/core/Result.js';

export interface ApplicationContext<T = Record<string, any>> {
	metadata?: Record<string, any>;
	data: T;
}

export type ApplicationHandlerFn<
	Message extends ICommand = ICommand,
	Context extends ApplicationContext = ApplicationContext,
	ResultData = any,
> = (
	message: Message,
	context?: Context,
) => TOrAnother<
	Result<ResultData, DomainError>,
	Promise<Result<ResultData, DomainError>>
>;

export type ApplicationMiddlewareFn<
	Message extends ICommand = ICommand,
	Context extends ApplicationContext = ApplicationContext,
> = (
	message: Message,
	context?: Context,
	next?: () => TOrAnother<
		Result<any, DomainError>,
		Promise<Result<any, DomainError>>
	>,
) => TOrAnother<Result<any, DomainError>, Promise<Result<any, DomainError>>>;

export interface ICommand {
	commandName: string;
}
