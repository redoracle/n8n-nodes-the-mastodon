const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const n8nNodesBase = require('eslint-plugin-n8n-nodes-base');
const globals = require('globals');

module.exports = [
	{
		ignores: ['.eslintrc.js', '**/*.js', '**/node_modules/**', '**/dist/**'],
	},
	{
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: ['./tsconfig.json'],
				sourceType: 'module',
				extraFileExtensions: ['.json'],
			},
			ecmaVersion: 2020,
			globals: {
				...globals.browser,
				...globals.es2020,
				...globals.node,
			},
		},
		// env property removed as it is not supported in flat config
	},
	{
		files: ['package.json'],
		plugins: {
			'n8n-nodes-base': n8nNodesBase,
		},
		rules: {
			'n8n-nodes-base/community-package-json-name-still-default': 'off',
		},
	},
	{
		files: ['./credentials/**/*.ts'],
		plugins: {
			'n8n-nodes-base': n8nNodesBase,
		},
		rules: {
			'n8n-nodes-base/cred-class-field-documentation-url-missing': 'off',
			'n8n-nodes-base/cred-class-field-documentation-url-miscased': 'off',
		},
	},
	{
		files: ['./nodes/**/*.ts'],
		plugins: {
			'n8n-nodes-base': n8nNodesBase,
		},
		rules: {
			'n8n-nodes-base/node-execute-block-missing-continue-on-fail': 'off',
			'n8n-nodes-base/node-resource-description-filename-against-convention': 'off',
			'n8n-nodes-base/node-param-fixed-collection-type-unsorted-items': 'off',
			'n8n-nodes-base/node-execute-block-operation-missing-singular-pairing': 'off',
			'n8n-nodes-base/node-execute-block-operation-missing-plural-pairing': 'off',
		},
	},
];
