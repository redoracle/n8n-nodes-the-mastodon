import { INodeProperties } from 'n8n-workflow';

export const searchOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['search'],
		},
	},
	options: [
		{
			name: 'Search',
			value: 'search',
			description: 'Search for content',
			action: 'Search for content',
		},
	],
	default: 'search',
};

export const searchFields: INodeProperties[] = [
	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['search'],
				operation: ['search'],
			},
		},
		description: 'The search query',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['search'],
				operation: ['search'],
			},
		},
		options: [
			{
				displayName: 'Type',
				name: 'type',
				type: 'options',
				options: [
					{
						name: 'Accounts',
						value: 'accounts',
					},
					{
						name: 'Hashtags',
						value: 'hashtags',
					},
					{
						name: 'Statuses',
						value: 'statuses',
					},
				],
				default: '',
				description: 'Specify type of results to return',
			},
			{
				displayName: 'Resolve',
				name: 'resolve',
				type: 'boolean',
				default: false,
				description: 'Attempt WebFinger lookup for remote accounts',
			},
			{
				displayName: 'Following',
				name: 'following',
				type: 'boolean',
				default: false,
				description: 'Only return accounts the user is following',
			},
			{
				displayName: 'Account ID',
				name: 'account_id',
				type: 'string',
				default: '',
				description: 'Filter statuses to this account ID',
			},
			{
				displayName: 'Exclude Unreviewed',
				name: 'exclude_unreviewed',
				type: 'boolean',
				default: false,
				description: 'Exclude unreviewed tags',
			},
			{
				displayName: 'Max ID',
				name: 'max_id',
				type: 'string',
				default: '',
				description: 'Return results older than this ID',
			},
			{
				displayName: 'Min ID',
				name: 'min_id',
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
];
