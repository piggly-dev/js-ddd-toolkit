import type moment from 'moment-timezone';

/** Globals */
export type TOrNull<T> = T | null;
export type TOrUndefined<T> = T | undefined;
export type TOrNullable<T> = TOrNull<T>;
export type TOrAnother<T, Another> = T | Another;
export type TOrFalse<T> = T | false;
export type TOrEmpty<T> = T | undefined | null;
export type TDateInput = number | string | Date | moment.Moment;
export type TObject = Record<any, any>;

export interface JSONExportable<
	Key extends string = string,
	Return extends Record<Key, any> = Record<Key, any>
> {
	toJSON(hide: Array<Key>): Return;
}

export interface ObjectExportable<
	Return extends Record<any, any> = Record<any, any>
> {
	toObject(): Return;
}
