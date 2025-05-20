module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testMatch: ['**/__tests__/**/*.test.ts'],
	moduleFileExtensions: ['ts', 'js'],
	transform: {
		'^.+\\.ts$': [
			'ts-jest',
			{
				tsconfig: 'tsconfig.json',
			},
		],
	},
};
