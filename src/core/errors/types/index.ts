import type {
	ObjectExportable,
	JSONExportable,
	TOrUndefined,
	TOrNullable,
} from '@/types';

export type ApplicationErrorJSON = {
	previous?: TOrNullable<PreviousErrorJSON>;
} & DomainErrorJSON;

export type DomainErrorHiddenProp = 'message' | 'extra' | 'code' | 'name' | 'hint';

export type DomainErrorJSON = {
	code: number;
	extra: TOrNullable<Record<any, any>>;
	hint: TOrNullable<string>;
	message: TOrNullable<string>;
	name: string;
};

export interface IApplicationError extends IDomainError {
	previousToObject(): TOrNullable<PreviousErrorJSON>;
	getPrevious(): TOrUndefined<PreviousError>;
	previous?: PreviousError;
}

export interface IDomainError
	extends JSONExportable<DomainErrorHiddenProp, DomainErrorJSON>,
		ObjectExportable<DomainErrorJSON> {
	is(class_name: string): boolean;
	extra?: Record<any, any>;
	message?: string;
	status: number;
	hint?: string;
	code: number;
	name: string;
}

export interface IRuntimeError
	extends JSONExportable<
			'message' | 'extra' | 'code' | 'name' | 'hint',
			DomainErrorJSON
		>,
		ObjectExportable<DomainErrorJSON>,
		Error {
	previousToObject(): TOrNullable<PreviousErrorJSON>;
	getPrevious(): TOrUndefined<PreviousError>;
	extra?: TOrNullable<Record<any, any>>;
	is(class_name: string): boolean;
	hint?: TOrNullable<string>;
	previous?: PreviousError;
	message: string;
	status: number;
	code: number;
	name: string;
}

export type PreviousError = IApplicationError | IRuntimeError | IDomainError | Error;

export type PreviousErrorJSON = {
	message: TOrNullable<string>;
	name: string;
	stack?: TOrNullable<PreviousErrorJSON | string>;
};

export type RuntimeErrorJSON = {
	message: string;
	name: string;
	stack?: TOrNullable<string>;
};
