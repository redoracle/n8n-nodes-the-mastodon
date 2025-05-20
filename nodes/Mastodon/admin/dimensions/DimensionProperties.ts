import { INodeProperties } from 'n8n-workflow';

export const dimensionOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['dimensions'],
			},
		},
		options: [
			{
				name: 'List All',
				value: 'listAll',
				description: 'Get all custom dimensions',
				action: 'List all dimensions',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a specific dimension',
				action: 'Get a dimension',
			},
		],
		default: 'listAll',
	},
] as INodeProperties[];

export const dimensionFields = [
	{
		displayName: 'Dimension ID',
		name: 'dimensionId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['dimensions'],
				operation: ['get'],
			},
		},
		description: 'ID of the dimension to retrieve',
	},
] as INodeProperties[];
