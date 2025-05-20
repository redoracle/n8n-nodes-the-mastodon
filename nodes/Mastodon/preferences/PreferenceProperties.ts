import { INodeProperties } from 'n8n-workflow';

export const preferenceOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['preferences'],
			},
		},
		options: [
			{
				name: 'Get User Preferences',
				value: 'get',
				description: 'Get authenticated user preferences',
				action: 'Get user preferences',
			},
		],
		default: 'get',
	},
] as INodeProperties[];

export const preferenceFields = [] as INodeProperties[];
