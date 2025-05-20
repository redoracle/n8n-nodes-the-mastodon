import { INodeProperties } from 'n8n-workflow';

export const featuredTagOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['featuredTags'],
			},
		},
		options: [
			{
				name: 'Get Featured Tags',
				value: 'list',
				description: 'Get a list of featured hashtags',
				action: 'Get featured tags',
			},
			{
				name: 'Feature Tag',
				value: 'feature',
				description: 'Feature a hashtag',
				action: 'Feature a tag',
			},
			{
				name: 'Unfeature Tag',
				value: 'unfeature',
				description: 'Unfeature a hashtag',
				action: 'Unfeature a tag',
			},
		],
		default: 'list',
	},
] as INodeProperties[];

export const featuredTagFields = [
	{
		displayName: 'Tag Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['featuredTags'],
				operation: ['feature'],
			},
		},
		description: 'The name of the hashtag to feature',
	},
	{
		displayName: 'Tag ID',
		name: 'tagId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['featuredTags'],
				operation: ['unfeature'],
			},
		},
		description: 'The ID of the featured tag to remove',
	},
] as INodeProperties[];
