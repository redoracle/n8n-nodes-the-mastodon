module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	testMatch: ['**/__tests__/**/*.test.ts'],
	moduleFileExtensions: ['ts', 'js'],
	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
	transform: {
		'^.+\\.ts$': [
			'ts-jest',
			{
				tsconfig: 'tsconfig.json',
			},
		],
	},
};
