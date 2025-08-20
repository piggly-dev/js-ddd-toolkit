import { EventEmitter } from '@/index';

describe('EventEmitter', () => {
	let emitter: EventEmitter;

	beforeEach(() => {
		emitter = new EventEmitter();
	});

	describe('on()', () => {
		it('should register event listener', () => {
			const listener = jest.fn();
			emitter.on('test', listener);

			emitter.emit('test', 'arg1', 'arg2');

			expect(listener).toHaveBeenCalledWith('arg1', 'arg2');
			expect(listener).toHaveBeenCalledTimes(1);
		});

		it('should register multiple listeners for same event', () => {
			const listener1 = jest.fn();
			const listener2 = jest.fn();

			emitter.on('test', listener1);
			emitter.on('test', listener2);

			emitter.emit('test', 'data');

			expect(listener1).toHaveBeenCalledWith('data');
			expect(listener2).toHaveBeenCalledWith('data');
		});

		it('should return unsubscribe function', () => {
			const listener = jest.fn();
			const unsubscribe = emitter.on('test', listener);

			emitter.emit('test', 'first');
			expect(listener).toHaveBeenCalledTimes(1);

			unsubscribe();

			emitter.emit('test', 'second');
			expect(listener).toHaveBeenCalledTimes(1);
		});

		it('should handle AbortSignal', () => {
			const listener = jest.fn();
			const controller = new AbortController();

			emitter.on('test', listener, { signal: controller.signal });

			emitter.emit('test', 'first');
			expect(listener).toHaveBeenCalledTimes(1);

			controller.abort();

			emitter.emit('test', 'second');
			expect(listener).toHaveBeenCalledTimes(1);
		});

		it('should handle already aborted signal', () => {
			const listener = jest.fn();
			const controller = new AbortController();
			controller.abort();

			emitter.on('test', listener, { signal: controller.signal });

			emitter.emit('test', 'data');
			expect(listener).not.toHaveBeenCalled();
		});
	});

	describe('once()', () => {
		it('should register listener that fires only once', () => {
			const listener = jest.fn();
			emitter.once('test', listener);

			emitter.emit('test', 'first');
			emitter.emit('test', 'second');
			emitter.emit('test', 'third');

			expect(listener).toHaveBeenCalledTimes(1);
			expect(listener).toHaveBeenCalledWith('first');
		});

		it('should return unsubscribe function', () => {
			const listener = jest.fn();
			const unsubscribe = emitter.once('test', listener);

			unsubscribe();

			emitter.emit('test', 'data');
			expect(listener).not.toHaveBeenCalled();
		});
	});

	describe('off()', () => {
		it('should remove specific listener', () => {
			const listener1 = jest.fn();
			const listener2 = jest.fn();

			emitter.on('test', listener1);
			emitter.on('test', listener2);

			emitter.off('test', listener1);

			emitter.emit('test', 'data');

			expect(listener1).not.toHaveBeenCalled();
			expect(listener2).toHaveBeenCalledWith('data');
		});

		it('should remove all listeners for event when no listener specified', () => {
			const listener1 = jest.fn();
			const listener2 = jest.fn();

			emitter.on('test', listener1);
			emitter.on('test', listener2);

			emitter.off('test');

			emitter.emit('test', 'data');

			expect(listener1).not.toHaveBeenCalled();
			expect(listener2).not.toHaveBeenCalled();
		});

		it('should handle removing from non-existent event', () => {
			expect(() => emitter.off('nonexistent')).not.toThrow();
		});
	});

	describe('emit()', () => {
		it('should emit event to all listeners', () => {
			const listener1 = jest.fn();
			const listener2 = jest.fn();

			emitter.on('test', listener1);
			emitter.on('test', listener2);

			emitter.emit('test', 'arg1', 'arg2', 'arg3');

			expect(listener1).toHaveBeenCalledWith('arg1', 'arg2', 'arg3');
			expect(listener2).toHaveBeenCalledWith('arg1', 'arg2', 'arg3');
		});

		it('should handle emitting non-existent event', () => {
			expect(() => emitter.emit('nonexistent', 'data')).not.toThrow();
		});

		it('should not affect original listeners array when listener modifies it', () => {
			let callCount = 0;
			const listener1 = jest.fn(() => {
				callCount++;
				if (callCount === 1) {
					emitter.off('test');
				}
			});
			const listener2 = jest.fn();

			emitter.on('test', listener1);
			emitter.on('test', listener2);

			emitter.emit('test', 'data');

			expect(listener1).toHaveBeenCalledWith('data');
			expect(listener2).toHaveBeenCalledWith('data');
		});
	});

	describe('unsubscribeAll()', () => {
		it('should remove all event listeners', () => {
			const listener1 = jest.fn();
			const listener2 = jest.fn();
			const listener3 = jest.fn();

			emitter.on('event1', listener1);
			emitter.on('event2', listener2);
			emitter.on('event3', listener3);

			emitter.unsubscribeAll();

			emitter.emit('event1', 'data');
			emitter.emit('event2', 'data');
			emitter.emit('event3', 'data');

			expect(listener1).not.toHaveBeenCalled();
			expect(listener2).not.toHaveBeenCalled();
			expect(listener3).not.toHaveBeenCalled();
		});
	});

	describe('integration tests', () => {
		it('should handle complex event flow', () => {
			const results: string[] = [];
			
			const listener1 = (data: string) => results.push(`listener1: ${data}`);
			const listener2 = (data: string) => results.push(`listener2: ${data}`);
			const listener3 = (data: string) => results.push(`listener3: ${data}`);

			emitter.on('test', listener1);
			const unsub2 = emitter.on('test', listener2);
			emitter.once('test', listener3);

			emitter.emit('test', 'first');
			expect(results).toEqual([
				'listener1: first',
				'listener2: first',
				'listener3: first'
			]);

			results.length = 0;
			unsub2();

			emitter.emit('test', 'second');
			expect(results).toEqual(['listener1: second']);
		});

		it('should handle multiple event types', () => {
			const eventLog: string[] = [];

			emitter.on('start', () => eventLog.push('started'));
			emitter.on('process', (data: string) => eventLog.push(`processing: ${data}`));
			emitter.on('end', () => eventLog.push('ended'));

			emitter.emit('start');
			emitter.emit('process', 'item1');
			emitter.emit('process', 'item2');
			emitter.emit('end');

			expect(eventLog).toEqual([
				'started',
				'processing: item1',
				'processing: item2',
				'ended'
			]);
		});
	});
});