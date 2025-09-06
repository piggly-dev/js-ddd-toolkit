module.exports = {
	verbose: true,
	rootDir: '.',
	roots: ['<rootDir>/src', '<rootDir>/test'],
	testMatch: ['**/test/*spec.+(ts)', '**/test/**/*spec.+(ts)'],
	collectCoverage: true,
	coverageThreshold: {
		global: {
			branches: 20,
			functions: 20,
			lines: 20,
			statements: 20,
		},
	},
	coveragePathIgnorePatterns: ['./node_modules/', './test/', './debug', './build'],
	coverageReporters: ['json-summary', 'text', 'lcov'],
	transform: {
		'^.+\\.[jt]s?$': [
			'ts-jest',
			{
				useESM: true,
				diagnostics: false,
				tsconfig: 'tsconfig.json',
			},
		],
	},
	preset: 'ts-jest',
	moduleFileExtensions: ['ts', 'js'],
	moduleNameMapper: {
		'@/(.*)\\.js$': '<rootDir>/src/$1.ts',
		'@/(.*)?': '<rootDir>/src/$1',
		'@test/(.*)\\.js$': '<rootDir>/test/$1.ts',
		'@test/(.*)': '<rootDir>/test/$1',
	},
	moduleDirectories: ['node_modules', '<rootDir>/src'],
	extensionsToTreatAsEsm: ['.ts'],
};
