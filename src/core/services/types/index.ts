import type { TOrUndefined } from '@/types';

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
