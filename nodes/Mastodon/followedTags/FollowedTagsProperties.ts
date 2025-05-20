import { INodeProperties } from 'n8n-workflow';

export const followedTagsOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['followedTags'],
			},
		},
		options: [
			{
				name: 'Get Followed Tags',
				value: 'list',
				description: 'Get a list of followed hashtags',
				action: 'Get followed tags',
			},
		],
		default: 'list',
	},
] as INodeProperties[];

export const followedTagsFields = [
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['followedTags'],
				operation: ['list'],
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
				default: 20,
				description: 'Maximum number of results to return',
			},
		],
	},
] as INodeProperties[];
