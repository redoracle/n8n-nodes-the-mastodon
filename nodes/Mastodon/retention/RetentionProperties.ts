// Modularized Retention properties for Mastodon node
import { INodeProperties } from 'n8n-workflow';

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
				description: 'Get user retention statistics',
				action: 'View retention statistics',
			},
		],
		default: 'viewStatistics',
	},
] as INodeProperties[];

// No additional fields needed for retention operations
export const retentionFields = [] as INodeProperties[];
