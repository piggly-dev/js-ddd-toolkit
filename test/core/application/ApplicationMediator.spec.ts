import type {
	ApplicationContext,
	IMessage,
} from '@/core/application/types/index.js';

import { ApplicationMediatorError } from '@/core/errors/ApplicationMediatorError.js';
import { ApplicationMediator } from '@/core/application/ApplicationMediator.js';
import { Result } from '@/core/Result.js';

class TestMessage implements IMessage {
	constructor(
		public commandName: string,
		public props: Record<string, any> = {},
	) {}
}

describe('ApplicationMediator', () => {
	let mediator: ApplicationMediator;

	beforeEach(() => {
		mediator = new ApplicationMediator();
	});

	describe('Handler Registration', () => {
		it('should register a handler instance', () => {
			const handler = {
				handle: jest.fn().mockResolvedValue(Result.ok('success')),
				get handlerFor() {
					return 'test.message';
				},
			};

			mediator.register(handler);

			expect(mediator.has('test.message')).toBe(true);
			/* @ts-expect-error - Handler is private */
			expect(mediator._handlers.get('test.message')).toBe(handler);
		});

		it('should register multiple handlers', () => {
			const handler1 = {
				handle: jest.fn().mockResolvedValue(Result.ok('h1')),
				get handlerFor() {
					return 'test.message1';
				},
			};
			const handler2 = {
				handle: jest.fn().mockResolvedValue(Result.ok('h2')),
				get handlerFor() {
					return 'test.message2';
				},
			};

			mediator.register(handler1);
			mediator.register(handler2);

			expect(mediator.has('test.message1')).toBe(true);
			expect(mediator.has('test.message2')).toBe(true);
		});
	});

	describe('Middleware Management', () => {
		it('should add middleware instance', () => {
			const middleware = { apply: jest.fn() } as any;
			mediator.middleware(middleware);

			/* @ts-expect-error - Middleware is private */
			expect(mediator._middlewares.length).toBe(1);
		});

		it('should add multiple middlewares', () => {
			const middleware1 = { apply: jest.fn() } as any;
			const middleware2 = { apply: jest.fn() } as any;

			mediator.middleware(middleware1);
			mediator.middleware(middleware2);

			/* @ts-expect-error - Middleware is private */
			expect(mediator._middlewares.length).toBe(2);
		});
	});

	describe('Message Sending', () => {
		it('should successfully execute handler', async () => {
			const expectedResult = Result.ok('success');
			const handle = jest.fn().mockResolvedValue(expectedResult);
			const handler = {
				handle,
				get handlerFor() {
					return 'test.message';
				},
			};

			mediator.register(handler);

			const context: ApplicationContext = { data: {} };
			const message = new TestMessage('test.message', { value: 'data' });

			const result = await mediator.send(message, context);

			expect(result.isSuccess).toBe(true);
			expect(result.data).toBe('success');
			expect(handle).toHaveBeenCalledWith(message, context);
		});

		it('should return error when handler not found', async () => {
			const context: ApplicationContext = { data: {} };
			const message = new TestMessage('unknown.message', { value: 'data' });

			const result = await mediator.send(message, context);

			expect(result.isFailure).toBe(true);
			expect(result.error).toBeInstanceOf(ApplicationMediatorError);
			expect(result.error.message).toContain(
				'No handler registered for message: unknown.message',
			);
		});

		it('should execute middlewares before handler', async () => {
			const executionOrder: string[] = [];

			const handle = jest.fn().mockImplementation(async () => {
				executionOrder.push('handler');
				return Result.ok('success');
			});

			const middleware1 = {
				apply: jest.fn().mockImplementation(async (message, context, next) => {
					executionOrder.push('middleware1-before');
					const result = await (next
						? next()
						: Promise.resolve(Result.ok('noop')));
					executionOrder.push('middleware1-after');
					return result;
				}),
			};

			const middleware2 = {
				apply: jest.fn().mockImplementation(async (message, context, next) => {
					executionOrder.push('middleware2-before');
					const result = await (next
						? next()
						: Promise.resolve(Result.ok('noop')));
					executionOrder.push('middleware2-after');
					return result;
				}),
			};

			mediator.middleware(middleware1 as any);
			mediator.middleware(middleware2 as any);
			mediator.register({
				handle,
				get handlerFor() {
					return 'test.message';
				},
			});

			const context: ApplicationContext = { data: {} };
			const message = new TestMessage('test.message', { value: 'data' });

			await mediator.send(message, context);

			expect(executionOrder).toEqual([
				'middleware1-before',
				'middleware2-before',
				'handler',
				'middleware2-after',
				'middleware1-after',
			]);
		});

		it('should pass message to middlewares', async () => {
			const handle = jest.fn().mockResolvedValue(Result.ok('success'));
			const middleware = {
				apply: jest
					.fn()
					.mockImplementation(async (message, context, next) =>
						next ? next() : Result.ok('noop'),
					),
			};

			mediator.middleware(middleware as any);
			mediator.register({
				handle,
				get handlerFor() {
					return 'test.message';
				},
			});

			const context: ApplicationContext = { data: {} };
			const message = new TestMessage('test.message', { value: 'data' });

			await mediator.send(message, context);

			expect(middleware.apply as jest.Mock).toHaveBeenCalledWith(
				message,
				context,
				expect.any(Function),
			);
			expect(handle).toHaveBeenCalledWith(message, context);
		});
	});

	describe('Utility Methods', () => {
		it('should clear all handlers and middlewares', () => {
			mediator.register({
				handle: jest.fn().mockResolvedValue(Result.ok('ok')),
				get handlerFor() {
					return 'test.message';
				},
			});
			mediator.middleware({ apply: jest.fn() } as any);

			expect(mediator.has('test.message')).toBe(true);

			mediator.clear();

			expect(mediator.has('test.message')).toBe(false);
			/* @ts-expect-error - Middleware is private */
			expect(mediator._middlewares.length).toBe(0);
		});
	});
});
