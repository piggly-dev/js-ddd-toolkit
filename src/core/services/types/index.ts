export type JWTBuilderServiceSettings = {
	audience?: string;
	issuer: string;
	private_key: string;
	public_key: string;
};

export type LoggerFn = (message?: any, ...optionalParams: any[]) => Promise<void>;

export type LoggerServiceSettings = {
	callbacks: Partial<{
		onDebug: LoggerFn;
		onError: LoggerFn;
		onFatal: LoggerFn;
		onInfo: LoggerFn;
		onWarn: LoggerFn;
	}>;
	// Uncatched errors
	onError?: (error: Error) => void;
	// Publish/flushes logs
	onFlush?: () => Promise<void>;
	// If true, the logger will always log to the console
	alwaysOnConsole: boolean;
	// The logger service will ignore any unset logger functions
	ignoreUnset: boolean;
};
