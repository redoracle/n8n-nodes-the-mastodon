import { INodeProperties } from 'n8n-workflow';

export const notificationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['notifications'],
			},
		},
		options: [
			{
				name: 'Get Notifications',
				value: 'get',
				description: 'Retrieve notifications for authenticated user',
				action: 'Get notifications',
			},
			{
				name: 'Dismiss Notification',
				value: 'dismiss',
				description: 'Dismiss a specific notification',
				action: 'Dismiss notification',
			},
			{
				name: 'Get Unread Count',
				value: 'unreadCount',
				description: 'Get number of unread notifications',
				action: 'Get unread count',
			},
		],
		default: 'get',
	},
];

export const notificationFields: INodeProperties[] = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['notifications'],
				operation: ['get'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['notifications'],
				operation: ['get'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 40,
		},
		default: 20,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Notification ID',
		name: 'id',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['notifications'],
				operation: ['dismiss'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the notification to dismiss',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		displayOptions: {
			show: {
				resource: ['notifications'],
				operation: ['get'],
			},
		},
		default: {},
		placeholder: 'Add Field',
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
				displayName: 'Min ID',
				name: 'min_id',
				type: 'string',
				default: '',
				description: 'Return results immediately newer than this ID',
			},
			{
				displayName: 'Types',
				name: 'types',
				type: 'multiOptions',
				options: [
					{
						name: 'Follow',
						value: 'follow',
					},
					{
						name: 'Favourite',
						value: 'favourite',
					},
					{
						name: 'Reblog',
						value: 'reblog',
					},
					{
						name: 'Mention',
						value: 'mention',
					},
					{
						name: 'Poll',
						value: 'poll',
					},
				],
				default: [],
				description: 'Types of notifications to include',
			},
			{
				displayName: 'Exclude Types',
				name: 'exclude_types',
				type: 'multiOptions',
				options: [
					{
						name: 'Follow',
						value: 'follow',
					},
					{
						name: 'Favourite',
						value: 'favourite',
					},
					{
						name: 'Reblog',
						value: 'reblog',
					},
					{
						name: 'Mention',
						value: 'mention',
					},
					{
						name: 'Poll',
						value: 'poll',
					},
				],
				default: [],
				description: 'Types of notifications to exclude',
			},
		],
	},
] as INodeProperties[];
