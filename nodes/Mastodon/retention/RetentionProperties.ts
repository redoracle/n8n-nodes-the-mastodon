import { INodeProperties } from 'n8n-workflow';

// Mastodon requires start_at, end_at and frequency for POST /api/v1/admin/retention.
export const retentionOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['retention'],
			},
		},
		options: [
			{
				name: 'View Statistics',
				value: 'viewStatistics',
				description: 'Get user retention statistics for a date range',
				action: 'View retention statistics',
			},
		],
		default: 'viewStatistics',
	},
] as INodeProperties[];

export const retentionFields = [
	{
		displayName: 'Start Date',
		name: 'start_at',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['retention'], operation: ['viewStatistics'] } },
		description: 'Start of the retention period',
	},
	{
		displayName: 'End Date',
		name: 'end_at',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['retention'], operation: ['viewStatistics'] } },
		description: 'End of the retention period',
	},
	{
		displayName: 'Frequency',
		name: 'frequency',
		type: 'options',
		default: 'day',
		displayOptions: { show: { resource: ['retention'], operation: ['viewStatistics'] } },
		options: [
			{ name: 'Day', value: 'day' },
			{ name: 'Month', value: 'month' },
		],
		description: 'Bucket size for the retention cohort',
	},
] as INodeProperties[];
