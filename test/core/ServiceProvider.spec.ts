import { ServiceProvider } from '@/index';

describe('ServiceProvider', () => {
	beforeEach(() => {
		ServiceProvider.clear();
	});

	it('should register a new service', () => {
		const instance = { name: 'service' };

		ServiceProvider.register('service', instance);
		expect(ServiceProvider.resolve('service')).toBe(instance);
	});

	it('should throw an error if service is already registered', () => {
		const instance = { name: 'service' };

		ServiceProvider.register('service', instance);

		expect(() => ServiceProvider.register('service', instance)).toThrowError(
			`Service "service" already registered.`,
		);
	});

	it('should resolve a service', () => {
		const instance = { name: 'service' };

		ServiceProvider.register('service', instance);
		expect(ServiceProvider.resolve('service')).toBe(instance);
	});

	it('should throw an error if service is not registered', () => {
		expect(() => ServiceProvider.resolve('service')).toThrowError(
			`Service "service" not found.`,
		);
	});
});
