import type moment from 'moment-timezone';

/** Globals */
export interface JSONExportable<
	Key extends string = string,
	Return extends Record<Key, any> = Record<Key, any>,
> {
	toJSON(hide: Array<Key>): Return;
}
export interface ObjectExportable<
	Return extends Record<any, any> = Record<any, any>,
> {
	toObject(): Return;
}
export type TDateInput = moment.Moment | number | string | Date;
export type TObject = Record<any, any>;
export type TOrAnother<T, Another> = Another | T;
export type TOrEmpty<T> = undefined | null | T;
export type TOrFalse<T> = false | T;
export type TOrNull<T> = null | T;

export type TOrNullable<T> = TOrNull<T>;

export type TOrUndefined<T> = undefined | T;
