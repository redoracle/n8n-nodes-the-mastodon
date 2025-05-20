module.exports = {
	extends: './.eslintrc.js',
	overrides: [
		{
			files: ['package.json'],
			plugins: ['eslint-plugin-n8n-nodes-base'],
			rules: {
				// Enforce that the package.json name field is not the default value
				'n8n-nodes-base/community-package-json-name-still-default': 'error',
			},
		},
	],
};
