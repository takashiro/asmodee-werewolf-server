module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	globals: {
		'ts-jest': {
			tsconfig: 'test/tsconfig.json',
		},
	},
	collectCoverage: true,
	collectCoverageFrom: [
		'src/**/*.ts',
	],
	coverageDirectory: 'build/coverage',
};
