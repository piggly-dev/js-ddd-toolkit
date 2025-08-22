import type {
	ApplicationContext,
	IMessage,
} from '@/core/application/types/index.js';

import { ApplicationMediatorError } from '@/core/errors/ApplicationMediatorError.js';
import { ApplicationMediator } from '@/core/application/ApplicationMediator.js';
import { Result } from '@/core/Result.js';

class TestMessage implements IMessage {
	constructor(
		public name: string,
		public props: Record<string, any> = {},
	) {}
}

describe('ApplicationMediator', () => {
	let mediator: ApplicationMediator;

	beforeEach(() => {
		mediator = new ApplicationMediator();
	});

	describe('Handler Registration', () => {
		it('should register a handler function', () => {
			const handler = jest.fn();
			mediator.register('test.message', handler);

			expect(mediator.has('test.message')).toBe(true);
			/* @ts-expect-error - Handler is private */
			expect(mediator._handlers.get('test.message')).toBe(handler);
		});

		it('should register multiple handlers', () => {
			const handler1 = jest.fn();
			const handler2 = jest.fn();

			mediator.register('test.message1', handler1);
			mediator.register('test.message2', handler2);

			expect(mediator.has('test.message1')).toBe(true);
			expect(mediator.has('test.message2')).toBe(true);
		});
	});

	describe('Middleware Management', () => {
		it('should add middleware function', () => {
			const middleware = jest.fn();
			mediator.middleware(middleware);

			/* @ts-expect-error - Middleware is private */
			expect(mediator._middlewares.length).toBe(1);
		});

		it('should add multiple middlewares', () => {
			const middleware1 = jest.fn();
			const middleware2 = jest.fn();

			mediator.middleware(middleware1);
			mediator.middleware(middleware2);

			/* @ts-expect-error - Middleware is private */
			expect(mediator._middlewares.length).toBe(2);
		});
	});

	describe('Message Sending', () => {
		it('should successfully execute handler', async () => {
			const expectedResult = Result.ok('success');
			const handler = jest.fn().mockReturnValue(expectedResult);

			mediator.register('test.message', handler);

			const context: ApplicationContext = { data: {} };
			const message = new TestMessage('test.message', { value: 'data' });

			const result = await mediator.send(message, context);

			expect(result.isSuccess).toBe(true);
			expect(result.data).toBe('success');
			expect(handler).toHaveBeenCalledWith(message, context);
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

			const handler = jest.fn().mockImplementation(() => {
				executionOrder.push('handler');
				return Result.ok('success');
			});

			const middleware1 = jest
				.fn()
				.mockImplementation((message, context, next) => {
					executionOrder.push('middleware1-before');
					const result = next();
					executionOrder.push('middleware1-after');
					return result;
				});

			const middleware2 = jest
				.fn()
				.mockImplementation((message, context, next) => {
					executionOrder.push('middleware2-before');
					const result = next();
					executionOrder.push('middleware2-after');
					return result;
				});

			mediator.middleware(middleware1);
			mediator.middleware(middleware2);
			mediator.register('test.message', handler);

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
			const handler = jest.fn().mockReturnValue(Result.ok('success'));
			const middleware = jest
				.fn()
				.mockImplementation((message, context, next) => next());

			mediator.middleware(middleware);
			mediator.register('test.message', handler);

			const context: ApplicationContext = { data: {} };
			const message = new TestMessage('test.message', { value: 'data' });

			await mediator.send(message, context);

			expect(middleware).toHaveBeenCalledWith(
				message,
				context,
				expect.any(Function),
			);
			expect(handler).toHaveBeenCalledWith(message, context);
		});
	});

	describe('Utility Methods', () => {
		it('should clear all handlers and middlewares', () => {
			mediator.register('test.message', jest.fn());
			mediator.middleware(jest.fn());

			expect(mediator.has('test.message')).toBe(true);

			mediator.clear();

			expect(mediator.has('test.message')).toBe(false);
			/* @ts-expect-error - Middleware is private */
			expect(mediator._middlewares.length).toBe(0);
		});
	});
});
