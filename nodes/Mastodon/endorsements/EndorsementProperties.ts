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
				value: 'get',
				description: 'Get a list of featured accounts',
				action: 'Get endorsements',
			},
		],
		default: 'get',
	},
] as INodeProperties[];

export const endorsementFields = [
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['endorsements'],
				operation: ['get'],
			},
		},
		options: [
			{
				displayName: 'Max ID',
				name: 'max_id',
				type: 'string',
				default: '',
				description: 'Return results older than this ID',
			},
			{
				displayName: 'Since ID',
				name: 'since_id',
				type: 'string',
				default: '',
				description: 'Return results newer than this ID',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 40,
				description: 'Maximum number of results to return',
			},
		],
	},
] as INodeProperties[];
