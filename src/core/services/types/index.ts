import type { LogLevel } from '@/core/services/schemas/index.js';
import type { TOrUndefined } from '@/types/index.js';

/**
 * Store service.
 *
 * Implementation for a key-value store. It must to be able to:
 *
 * - Set a value with a TTL.
 * - Get a value and delete it.
 * - Increment a value.
 * - Get a value.
 * - Reset the increment value.
 * - Delete a value.
 * - Check if a value exists.
 *
 * @since 4.1.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export interface IStoreService {
	set<T = any>(key: string, value: T, ttl?: number): Promise<boolean>;
	getAndDelete(key: string): Promise<TOrUndefined<string>>;
	increment(key: string, amount: number): Promise<number>;
	get(key: string): Promise<TOrUndefined<string>>;
	resetIncrement(key: string): Promise<number>;
	delete(key: string): Promise<boolean>;
	has(key: string): Promise<boolean>;
}

/**
 * Logger service.
 *
 * @since 5.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export interface ILoggerService {
	debug(message?: string, ...args: any[]): void;
	error(message?: string, ...args: any[]): void;
	fatal(message?: string, ...args: any[]): void;
	info(message?: string, ...args: any[]): void;
	warn(message?: string, ...args: any[]): void;
	wait(ms: number): Promise<void>;
	cleanup(): Promise<void>;
	flush(): void;
}

/**
 * File Log Service.
 *
 * @since 5.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export interface IFileLogService {
	log(level: LogLevel, message: string): void;
	flush(level: LogLevel): void;
	cleanup(): void;
}

/**
 * PromisesHandlerService.
 *
 * @since 5.0.0
 * @author Caique Araujo <caique@piggly.com.br>
 */
export interface IPromisesHandlerService {
	register(promise: Promise<any>): void;
	cleanup(): Promise<void>;
	size: number;
}
