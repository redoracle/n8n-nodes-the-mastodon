import { INodeProperties } from 'n8n-workflow';

export const endorsementOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['endorsements'],
			},
		},
		options: [
			{
				name: 'Get Endorsements',
				value: 'list',
				description: 'Get a list of featured accounts',
				action: 'Get endorsements',
			},
		],
		default: 'list',
	},
] as INodeProperties[];

export const endorsementFields = [] as INodeProperties[];
