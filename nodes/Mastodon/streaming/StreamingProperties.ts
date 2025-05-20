import { INodeProperties } from 'n8n-workflow';

export const streamingOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['streaming'],
			},
		},
		options: [
			{
				name: 'Stream Public Timeline',
				value: 'public',
				description: 'Stream all public statuses',
				action: 'Stream public timeline',
			},
			{
				name: 'Stream Hashtag Timeline',
				value: 'hashtag',
				description: 'Stream public statuses for a specific hashtag',
				action: 'Stream hashtag timeline',
			},
			{
				name: 'Stream User Timeline',
				value: 'user',
				description: 'Stream user-related events',
				action: 'Stream user timeline',
			},
		],
		default: 'public',
	},
];

export const streamingFields: INodeProperties[] = [
	{
		displayName: 'Tag',
		name: 'tag',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['streaming'],
				operation: ['hashtag'],
			},
		},
		default: '',
		description: 'The hashtag to stream (without the # symbol)',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['streaming'],
				operation: ['public', 'hashtag'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Local',
				name: 'local',
				type: 'boolean',
				default: false,
				description: 'Only show local statuses',
			},
		],
	},
] as INodeProperties[];
