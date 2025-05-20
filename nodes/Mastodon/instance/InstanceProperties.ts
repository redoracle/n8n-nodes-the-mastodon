import { INodeProperties } from 'n8n-workflow';

export const instanceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['instance'],
			},
		},
		options: [
			{
				name: 'Get Server Information',
				value: 'getServerInfo',
				description: 'Get information about the server',
				action: 'Get server information',
			},
		],
		default: 'getServerInfo',
	},
];
