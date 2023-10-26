export type PaginateQuery = {
	page: number;
	size: number;
};

export type SQL_ERROR_EVENT<Error = any> = {
	sql: string;
	values?: any[];
	error: Error;
};
