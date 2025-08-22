import type { ApplicationError } from '@/core/errors/ApplicationError.js';
import type { TOrAnother } from '@/types/index.js';
import type { Result } from '@/core/Result.js';

export interface ApplicationContext<T = Record<string, any>> {
	metadata?: Record<string, any>;
	data: T;
}

export type ApplicationHandlerFn<
	Message extends IMessage = IMessage,
	Context extends ApplicationContext = ApplicationContext,
	ResultData = any,
> = (
	message: Message,
	context: Context,
) => TOrAnother<
	Result<ResultData, ApplicationError>,
	Promise<Result<ResultData, ApplicationError>>
>;

export type ApplicationMiddlewareFn<
	Message extends IMessage = IMessage,
	Context extends ApplicationContext = ApplicationContext,
> = (
	message: Message,
	context: Context,
	next: () => TOrAnother<
		Result<any, ApplicationError>,
		Promise<Result<any, ApplicationError>>
	>,
) => TOrAnother<
	Result<any, ApplicationError>,
	Promise<Result<any, ApplicationError>>
>;

export interface IMessage<Props extends Record<string, any> = Record<string, any>> {
	name: string;
	props: Props;
}
