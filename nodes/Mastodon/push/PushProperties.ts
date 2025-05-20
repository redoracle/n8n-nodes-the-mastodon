import { INodeProperties } from 'n8n-workflow';

export const pushOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['push'],
		},
	},
	options: [
		{
			name: 'Subscribe to Push Notifications',
			value: 'subscribe',
			description: 'Subscribe to push notifications',
			action: 'Subscribe to push notifications',
		},
		{
			name: 'Get Current Subscription',
			value: 'get',
			description: 'Get current push subscription',
			action: 'Get current subscription',
		},
		{
			name: 'Update Subscription',
			value: 'update',
			description: 'Update push subscription',
			action: 'Update subscription',
		},
		{
			name: 'Delete Subscription',
			value: 'remove',
			description: 'Delete push subscription',
			action: 'Delete subscription',
		},
	],
	default: 'subscribe',
};

export const pushFields: INodeProperties[] = [
	{
		displayName: 'Subscription',
		name: 'subscription',
		type: 'fixedCollection',
		default: {},
		typeOptions: {
			multipleValues: false,
		},
		displayOptions: {
			show: {
				resource: ['push'],
				operation: ['subscribe'],
			},
		},
		description: 'The subscription details',
		options: [
			{
				name: 'metadataValues',
				displayName: 'Metadata',
				values: [
					{
						displayName: 'Endpoint URL',
						name: 'endpoint',
						type: 'string',
						default: '',
						required: true,
						description: 'The endpoint URL to receive push notifications',
					},
					{
						displayName: 'Keys',
						name: 'keys',
						type: 'fixedCollection',
						default: {},
						typeOptions: {
							multipleValues: false,
						},
						options: [
							{
								name: 'keyValues',
								displayName: 'Keys',
								values: [
									{
										displayName: 'P256DH Key',
										name: 'p256dh',
										type: 'string',
										default: '',
										required: true,
										description: 'User agent public key (Base64 encoded)',
									},
									{
										displayName: 'Auth Secret',
										name: 'auth',
										type: 'string',
										default: '',
										required: true,
										description: 'Auth secret (Base64 encoded)',
									},
								],
							},
						],
					},
				],
			},
		],
	},
	{
		displayName: 'Alerts',
		name: 'alerts',
		type: 'collection',
		default: {},
		placeholder: 'Add Alert Setting',
		displayOptions: {
			show: {
				resource: ['push'],
				operation: ['subscribe', 'update'],
			},
		},
		options: [
			{
				displayName: 'Mentions',
				name: 'mention',
				type: 'boolean',
				default: true,
				description: 'Receive notifications for mentions',
			},
			{
				displayName: 'New Statuses',
				name: 'status',
				type: 'boolean',
				default: false,
				description: 'Receive notifications for new statuses',
			},
			{
				displayName: 'Boosts',
				name: 'reblog',
				type: 'boolean',
				default: false,
				description: 'Receive notifications for boosts',
			},
			{
				displayName: 'Follows',
				name: 'follow',
				type: 'boolean',
				default: false,
				description: 'Receive notifications for follows',
			},
			{
				displayName: 'Follow Requests',
				name: 'follow_request',
				type: 'boolean',
				default: false,
				description: 'Receive notifications for follow requests',
			},
			{
				displayName: 'Favourites',
				name: 'favourite',
				type: 'boolean',
				default: false,
				description: 'Receive notifications for favourites',
			},
			{
				displayName: 'Polls',
				name: 'poll',
				type: 'boolean',
				default: false,
				description: 'Receive notifications for polls',
			},
			{
				displayName: 'Status Updates',
				name: 'update',
				type: 'boolean',
				default: false,
				description: 'Receive notifications for status updates',
			},
			{
				displayName: 'Admin: New Sign-ups',
				name: 'admin.sign_up',
				type: 'boolean',
				default: false,
				description: 'Receive notifications for new sign-ups (admin only)',
			},
			{
				displayName: 'Admin: New Reports',
				name: 'admin.report',
				type: 'boolean',
				default: false,
				description: 'Receive notifications for new reports (admin only)',
			},
		],
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['push'],
				operation: ['subscribe', 'update'],
			},
		},
		options: [
			{
				displayName: 'Policy',
				name: 'policy',
				type: 'string',
				default: '',
				description: 'Notification delivery policy',
			},
		],
	},
];
