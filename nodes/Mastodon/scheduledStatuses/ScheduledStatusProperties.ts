import { INodeProperties } from 'n8n-workflow';

export const scheduledStatusOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['scheduledStatuses'],
			},
		},
		options: [
			{
				name: 'List Scheduled Statuses',
				value: 'list',
				description: 'Get a list of scheduled statuses',
				action: 'List scheduled statuses',
			},
			{
				name: 'View Scheduled Status',
				value: 'view',
				description: 'Get details of a scheduled status',
				action: 'View a scheduled status',
			},
			{
				name: 'Update Scheduled Status',
				value: 'update',
				description: 'Update the scheduled time of a status',
				action: 'Update a scheduled status',
			},
			{
				name: 'Cancel Scheduled Status',
				value: 'cancel',
				description: 'Cancel a scheduled status',
				action: 'Cancel a scheduled status',
			},
		],
		default: 'list',
	},
] as INodeProperties[];

export const scheduledStatusFields = [
	// Fields for listing scheduled statuses
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['scheduledStatuses'],
				operation: ['list'],
			},
		},
		options: [
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 40,
				},
				default: 20,
				description: 'Maximum number of results to return (max: 40)',
			},
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
		],
	},

	// Fields for viewing/updating/canceling a scheduled status
	{
		displayName: 'Status ID',
		name: 'statusId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['scheduledStatuses'],
				operation: ['view', 'update', 'cancel'],
			},
		},
		description: 'ID of the scheduled status',
	},

	// Fields for updating scheduled time
	{
		displayName: 'Scheduled Time',
		name: 'scheduledAt',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['scheduledStatuses'],
				operation: ['update'],
			},
		},
		description: 'The new scheduled time in ISO 8601 format',
		placeholder: '2025-05-01T10:00:00Z',
	},
] as INodeProperties[];
