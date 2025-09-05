import {
	OnGoingPromisesServiceSettingsSchema,
	FileLogStreamServiceSettingsSchema,
	LoggerServiceSettingsSchema,
	LogLevelSchema,
	LoggerFnSchema,
} from '@/index';
import { JWTBuilderServiceSettingsSchema } from '@/core/jwt/schemas/index.js';
import * as utils from '@/utils';

// Mock the utils functions
jest.mock('@/utils', () => ({
	evaluateAbspath: jest.fn(),
	parseAbspath: jest.fn(path => path),
}));

describe('Schemas', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	describe('LogLevelSchema', () => {
		it('should validate valid log levels', () => {
			expect(LogLevelSchema.parse('debug')).toBe('debug');
			expect(LogLevelSchema.parse('info')).toBe('info');
			expect(LogLevelSchema.parse('warn')).toBe('warn');
			expect(LogLevelSchema.parse('error')).toBe('error');
			expect(LogLevelSchema.parse('fatal')).toBe('fatal');
		});

		it('should reject invalid log levels', () => {
			expect(() => LogLevelSchema.parse('invalid')).toThrow();
			expect(() => LogLevelSchema.parse(123)).toThrow();
		});

		it.each([
			['debug', true],
			['info', true],
			['warn', true],
			['error', true],
			['fatal', true],
			['trace', false],
			['invalid', false],
			[123, false],
			[null, false],
			[undefined, false],
		])('should validate "%s" as %s', (input, shouldBeValid) => {
			if (shouldBeValid) {
				expect(LogLevelSchema.safeParse(input).success).toBe(true);
			} else {
				expect(LogLevelSchema.safeParse(input).success).toBe(false);
			}
		});
	});

	describe('LoggerFnSchema', () => {
		it('should reject invalid logger functions', () => {
			expect(() => LoggerFnSchema.parse('not a function')).toThrow();
		});

		it.each([
			[async () => {}, true],
			[() => Promise.resolve(), true],
			[() => {}, true],
			[() => 'string', true],
			['not a function', false],
			[123, false],
			[null, false],
		])('should validate %p as %s', (input, shouldBeValid) => {
			if (shouldBeValid) {
				expect(LoggerFnSchema.safeParse(input).success).toBe(true);
			} else {
				expect(LoggerFnSchema.safeParse(input).success).toBe(false);
			}
		});
	});

	describe('FileLogStreamServiceSettingsSchema', () => {
		beforeEach(() => {
			(utils.evaluateAbspath as jest.Mock).mockReturnValue(true);
			(utils.parseAbspath as jest.Mock).mockReturnValue('/valid/path');
		});

		it('should validate valid settings with defaults', () => {
			const validSettings = {
				abspath: '/valid/path',
			};

			const parsed = FileLogStreamServiceSettingsSchema.parse(validSettings);
			expect(parsed.abspath).toBe('/valid/path');
			expect(parsed.levels).toEqual(['error', 'fatal']);
			expect(parsed.errorThreshold).toBe(10);
			expect(parsed.killOnLimit).toBe(false);
			expect(parsed.streamLimit).toBe(10000);
		});

		it('should validate fully specified settings', () => {
			const validSettings = {
				abspath: '/valid/path',
				errorThreshold: 5,
				killOnLimit: true,
				levels: ['debug', 'info'],
				streamLimit: 5000,
			};

			const parsed = FileLogStreamServiceSettingsSchema.parse(validSettings);
			expect(parsed.abspath).toBe('/valid/path');
			expect(parsed.levels).toEqual(['debug', 'info']);
			expect(parsed.errorThreshold).toBe(5);
			expect(parsed.killOnLimit).toBe(true);
			expect(parsed.streamLimit).toBe(5000);
		});

		it('should reject invalid settings', () => {
			(utils.evaluateAbspath as jest.Mock).mockReturnValue(false);

			expect(() =>
				FileLogStreamServiceSettingsSchema.parse({
					abspath: '/invalid/path',
				}),
			).toThrow();

			expect(() =>
				FileLogStreamServiceSettingsSchema.parse({
					abspath: '/valid/path',
					levels: ['invalid'],
				}),
			).toThrow();
		});

		it.each([
			[{ abspath: '/valid/path' }, true],
			[{ abspath: '/valid/path', levels: ['debug', 'error'] }, true],
			[{ abspath: '/valid/path', errorThreshold: 5 }, true],
			[{ abspath: '/valid/path', killOnLimit: true }, true],
			[{ abspath: '/valid/path', streamLimit: 5000 }, true],
			[{}, false],
			[{ abspath: '/valid/path', levels: ['invalid'] }, false],
			[{ abspath: '/valid/path', errorThreshold: 'not a number' }, false],
			[{ abspath: '/valid/path', killOnLimit: 'not a boolean' }, false],
			[{ abspath: '/valid/path', streamLimit: 'not a number' }, false],
		])('should validate %p as %s', (input, shouldBeValid) => {
			if (shouldBeValid) {
				expect(FileLogStreamServiceSettingsSchema.safeParse(input).success).toBe(
					true,
				);
			} else {
				expect(FileLogStreamServiceSettingsSchema.safeParse(input).success).toBe(
					false,
				);
			}
		});
	});

	describe('OnGoingPromisesServiceSettingsSchema', () => {
		it('should validate valid settings with defaults', () => {
			const validSettings = {};

			const parsed = OnGoingPromisesServiceSettingsSchema.parse(validSettings);
			expect(parsed.killOnLimit).toBe(false);
			expect(parsed.limit).toBe(10000);
		});

		it('should validate fully specified settings', () => {
			const validSettings = {
				killOnLimit: true,
				limit: 5000,
			};

			const parsed = OnGoingPromisesServiceSettingsSchema.parse(validSettings);
			expect(parsed.killOnLimit).toBe(true);
			expect(parsed.limit).toBe(5000);
		});

		it('should reject invalid settings', () => {
			expect(() =>
				OnGoingPromisesServiceSettingsSchema.parse({
					killOnLimit: 'not a boolean',
				}),
			).toThrow();

			expect(() =>
				OnGoingPromisesServiceSettingsSchema.parse({
					limit: 'not a number',
				}),
			).toThrow();
		});

		it.each([
			[{}, true],
			[{ killOnLimit: true }, true],
			[{ limit: 5000 }, true],
			[{ killOnLimit: true, limit: 5000 }, true],
			[{ killOnLimit: 'not a boolean' }, false],
			[{ limit: 'not a number' }, false],
			[{ unknown: 'property' }, true], // Extra properties are allowed by default in zod
		])('should validate %p as %s', (input, shouldBeValid) => {
			if (shouldBeValid) {
				expect(
					OnGoingPromisesServiceSettingsSchema.safeParse(input).success,
				).toBe(true);
			} else {
				expect(
					OnGoingPromisesServiceSettingsSchema.safeParse(input).success,
				).toBe(false);
			}
		});
	});

	describe('LoggerServiceSettingsSchema', () => {
		beforeEach(() => {
			(utils.evaluateAbspath as jest.Mock).mockReturnValue(true);
			(utils.parseAbspath as jest.Mock).mockReturnValue('/valid/path');
		});

		it('should validate valid settings with defaults', () => {
			const validSettings = {};

			const parsed = LoggerServiceSettingsSchema.parse(validSettings);
			expect(parsed.alwaysOnConsole).toBe(false);
			expect(parsed.callbacks).toEqual({});
			expect(parsed.ignoreLevels).toEqual([]);
			expect(parsed.ignoreUnset).toBe(true);
			expect(parsed.promises).toBeDefined();
			expect(parsed.promises.track).toEqual(['onError', 'onFatal']);
		});

		it('should validate fully specified settings', () => {
			const asyncFn = async () => {};
			const validSettings = {
				alwaysOnConsole: true,
				callbacks: {
					onDebug: asyncFn,
					onError: asyncFn,
				},
				file: {
					abspath: '/valid/path',
					levels: ['debug', 'info'],
				},
				ignoreLevels: ['warn'],
				ignoreUnset: false,
				onError: () => {},
				onFlush: asyncFn,
				promises: {
					killOnLimit: true,
					limit: 5000,
					track: ['onDebug', 'onInfo'],
				},
			};

			const parsed = LoggerServiceSettingsSchema.parse(validSettings);
			expect(parsed.alwaysOnConsole).toBe(true);
			expect(typeof parsed.callbacks.onDebug).toBe('function');
			expect(typeof parsed.callbacks.onError).toBe('function');
			expect(parsed.ignoreLevels).toEqual(['warn']);
			expect(parsed.ignoreUnset).toBe(false);
			expect(typeof parsed.onError).toBe('function');
			expect(typeof parsed.onFlush).toBe('function');
			expect(parsed.promises.track).toEqual(['onDebug', 'onInfo']);
			expect(parsed.promises.killOnLimit).toBe(true);
			expect(parsed.promises.limit).toBe(5000);
		});

		it('should reject invalid settings', () => {
			expect(() =>
				LoggerServiceSettingsSchema.parse({
					callbacks: {
						onDebug: 'not a function',
					},
				}),
			).toThrow();

			expect(() =>
				LoggerServiceSettingsSchema.parse({
					ignoreLevels: ['invalid'],
				}),
			).toThrow();
		});

		const asyncFn = async () => {};

		it.each([
			[{}, true],
			[{ alwaysOnConsole: true }, true],
			[{ callbacks: { onDebug: asyncFn } }, true],
			[{ file: { abspath: '/valid/path' } }, true],
			[{ ignoreLevels: ['debug', 'warn'] }, true],
			[{ ignoreUnset: false }, true],
			[{ onError: () => {} }, true],
			[{ onFlush: asyncFn }, true],
			[{ promises: { limit: 5000, track: ['onDebug'] } }, true],
			[{ callbacks: { onDebug: 'not a function' } }, false],
			[{ ignoreLevels: ['invalid'] }, false],
			[{ promises: { track: ['invalid'] } }, false],
		])('should validate %p as %s', (input, shouldBeValid) => {
			if (shouldBeValid) {
				expect(LoggerServiceSettingsSchema.safeParse(input).success).toBe(true);
			} else {
				expect(LoggerServiceSettingsSchema.safeParse(input).success).toBe(false);
			}
		});
	});

	describe('JWTBuilderServiceSettingsSchema', () => {
		it('should validate valid settings with required fields', () => {
			const validSettings = {
				algorithm: 'EdDSA',
				issuer: 'test-issuer',
				private_key: 'private-key-content',
				public_key: 'public-key-content',
			};

			const parsed = JWTBuilderServiceSettingsSchema.parse(validSettings);
			expect(parsed.issuer).toBe('test-issuer');
			expect(parsed.private_key).toBe('private-key-content');
			expect(parsed.public_key).toBe('public-key-content');
			expect(parsed.audience).toBeUndefined();
		});

		it('should validate fully specified settings', () => {
			const validSettings = {
				algorithm: 'EdDSA',
				audience: 'test-audience',
				issuer: 'test-issuer',
				private_key: 'private-key-content',
				public_key: 'public-key-content',
			};

			const parsed = JWTBuilderServiceSettingsSchema.parse(validSettings);
			expect(parsed.audience).toBe('test-audience');
			expect(parsed.issuer).toBe('test-issuer');
			expect(parsed.private_key).toBe('private-key-content');
			expect(parsed.public_key).toBe('public-key-content');
		});

		it('should reject invalid settings', () => {
			// Missing required field
			expect(() =>
				JWTBuilderServiceSettingsSchema.parse({
					private_key: 'private-key-content',
					public_key: 'public-key-content',
				}),
			).toThrow();

			// Invalid type
			expect(() =>
				JWTBuilderServiceSettingsSchema.parse({
					issuer: 123,
					private_key: 'private-key-content',
					public_key: 'public-key-content',
				}),
			).toThrow();
		});

		it.each([
			[
				{
					algorithm: 'EdDSA',
					issuer: 'test-issuer',
					private_key: 'private-key-content',
					public_key: 'public-key-content',
				},
				true,
			],
			[
				{
					algorithm: 'EdDSA',
					audience: 'test-audience',
					issuer: 'test-issuer',
					private_key: 'private-key-content',
					public_key: 'public-key-content',
				},
				true,
			],
			[
				{
					private_key: 'private-key-content',
					public_key: 'public-key-content',
				},
				false,
			],
			[
				{
					issuer: 'test-issuer',
					public_key: 'public-key-content',
				},
				false,
			],
			[
				{
					issuer: 'test-issuer',
					private_key: 'private-key-content',
				},
				false,
			],
			[
				{
					issuer: 123,
					private_key: 'private-key-content',
					public_key: 'public-key-content',
				},
				false,
			],
			[
				{
					issuer: 'test-issuer',
					private_key: 123,
					public_key: 'public-key-content',
				},
				false,
			],
			[
				{
					issuer: 'test-issuer',
					private_key: 'private-key-content',
					public_key: 123,
				},
				false,
			],
			[
				{
					audience: 123,
					issuer: 'test-issuer',
					private_key: 'private-key-content',
					public_key: 'public-key-content',
				},
				false,
			],
		])('should validate %p as %s', (input, shouldBeValid) => {
			if (shouldBeValid) {
				expect(JWTBuilderServiceSettingsSchema.safeParse(input).success).toBe(
					true,
				);
			} else {
				expect(JWTBuilderServiceSettingsSchema.safeParse(input).success).toBe(
					false,
				);
			}
		});
	});
});
