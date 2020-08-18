module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	globals: {
		'ts-jest': {
			tsConfig: 'test/tsconfig.json',
		},
	},
	collectCoverage: true,
	collectCoverageFrom: [
		'src/**/*.ts',
	],
	coverageDirectory: 'build/coverage',
};
