import type {
	ObjectExportable,
	JSONExportable,
	TOrUndefined,
	TOrNullable,
} from '@/types';

export type ApplicationErrorJSON = {
	previous?: TOrNullable<PreviousErrorJSON>;
} & DomainErrorJSON;

export type DataIssue = {
	field: string;
	message: string;
};

export type DataIssues = Array<DataIssue>;

export type DomainErrorHiddenProp = 'message' | 'extra' | 'code' | 'name' | 'hint';

export type DomainErrorJSON = {
	code: number;
	extra: TOrNullable<Record<any, any>>;
	hint: TOrNullable<string>;
	message: TOrNullable<string>;
	name: string;
};

export interface IApplicationError extends IDomainError {
	getPrevious(): TOrUndefined<PreviousError>;
	previous?: PreviousError;
	previousToObject(): TOrNullable<PreviousErrorJSON>;
}

export interface IDomainError
	extends
		JSONExportable<DomainErrorHiddenProp, DomainErrorJSON>,
		ObjectExportable<DomainErrorJSON> {
	code: number;
	extra?: Record<any, any>;
	hint?: string;
	is(class_name: string): boolean;
	message?: string;
	name: string;
	status: number;
}

export interface IRuntimeError
	extends
		JSONExportable<
			'message' | 'extra' | 'code' | 'name' | 'hint',
			DomainErrorJSON
		>,
		ObjectExportable<DomainErrorJSON>,
		Error {
	code: number;
	extra?: TOrNullable<Record<any, any>>;
	getPrevious(): TOrUndefined<PreviousError>;
	hint?: TOrNullable<string>;
	is(class_name: string): boolean;
	message: string;
	name: string;
	previous?: PreviousError;
	previousToObject(): TOrNullable<PreviousErrorJSON>;
	status: number;
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
