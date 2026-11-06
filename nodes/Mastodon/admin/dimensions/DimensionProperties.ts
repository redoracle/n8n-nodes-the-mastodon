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
				name: 'Get Common Dimensions',
				value: 'listAll',
				description: 'Get dimensions that do not require a tag or remote domain',
				action: 'List all dimensions',
			},
			{
				name: 'Get Dimension by Key',
				value: 'get',
				description: 'Get a dimension using the documented key',
				action: 'Get a dimension',
			},
		],
		default: 'listAll',
	},
] as INodeProperties[];

export const dimensionFields = [
	{
		displayName: 'Dimension Key',
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
		description: 'Dimension key, for example languages, sources or servers',
	},
] as INodeProperties[];
