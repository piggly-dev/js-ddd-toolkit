import type {
	JSONExportable,
	ObjectExportable,
	TOrNullable,
	TOrUndefined,
} from '@/types';

export type DomainErrorJSON = {
	code: number;
	name: string;
	message: TOrNullable<string>;
	hint: TOrNullable<string>;
	extra: TOrNullable<Record<any, any>>;
};

export type ApplicationErrorJSON = DomainErrorJSON & {
	previous?: TOrNullable<PreviousErrorJSON>;
};

export type RuntimeErrorJSON = {
	name: string;
	message: string;
	stack?: TOrNullable<string>;
};

export type PreviousErrorJSON = {
	name: string;
	message: TOrNullable<string>;
	stack?: TOrNullable<string | PreviousErrorJSON>;
};

export type PreviousError = IApplicationError | IDomainError | IRuntimeError | Error;

export type DomainErrorHiddenProp = 'code' | 'name' | 'message' | 'hint' | 'extra';

export interface IDomainError
	extends JSONExportable<DomainErrorHiddenProp, DomainErrorJSON>,
		ObjectExportable<DomainErrorJSON> {
	code: number;
	name: string;
	status: number;
	message?: string;
	hint?: string;
	extra?: Record<any, any>;
	is(class_name: string): boolean;
}

export interface IApplicationError extends IDomainError {
	previous?: PreviousError;
	getPrevious(): TOrUndefined<PreviousError>;
	previousToObject(): TOrNullable<PreviousErrorJSON>;
}

export interface IRuntimeError
	extends JSONExportable<
			'code' | 'name' | 'message' | 'hint' | 'extra',
			DomainErrorJSON
		>,
		ObjectExportable<DomainErrorJSON>,
		Error {
	code: number;
	name: string;
	status: number;
	message: string;
	hint?: TOrNullable<string>;
	extra?: TOrNullable<Record<any, any>>;
	previous?: PreviousError;
	getPrevious(): TOrUndefined<PreviousError>;
	previousToObject(): TOrNullable<PreviousErrorJSON>;
	is(class_name: string): boolean;
}
