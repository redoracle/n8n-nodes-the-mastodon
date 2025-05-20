import { INodeProperties } from 'n8n-workflow';

export const appsOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['apps'] } },
	options: [
		{
			name: 'Register Application',
			value: 'registerApp',
			description: 'Register a new OAuth application',
			action: 'Register application',
		},
		{
			name: 'Verify Credentials',
			value: 'verifyCredentials',
			description: "Verify application's OAuth credentials",
			action: 'Verify application credentials',
		},
	],
	default: 'registerApp',
};

export const appsFields: INodeProperties[] = [
	{
		displayName: 'Client Name',
		name: 'clientName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['apps'], operation: ['registerApp'] } },
		description: 'Name of your application',
	},
	{
		displayName: 'Redirect URIs',
		name: 'redirectUris',
		type: 'string',
		required: true,
		default: 'urn:ietf:wg:oauth:2.0:oob',
		displayOptions: { show: { resource: ['apps'], operation: ['registerApp'] } },
		description: 'Where the user will be redirected after authorization',
	},
	{
		displayName: 'Scopes',
		name: 'scopes',
		type: 'string',
		required: true,
		default: 'read write push',
		displayOptions: { show: { resource: ['apps'], operation: ['registerApp'] } },
		description: 'Space-separated list of scopes to request',
	},
	{
		displayName: 'Website',
		name: 'website',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['apps'], operation: ['registerApp'] } },
		description: 'Website URL of your application',
	},
];
