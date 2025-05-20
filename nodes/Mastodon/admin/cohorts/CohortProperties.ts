import { INodeProperties } from 'n8n-workflow';

export const cohortOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['cohorts'],
			},
		},
		options: [
			{
				name: 'Get Retention Data',
				value: 'getRetentionData',
				description: 'Get user retention metrics',
				action: 'Get user retention metrics',
			},
		],
		default: 'getRetentionData',
	},
] as INodeProperties[];

export const cohortFields = [
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['cohorts'],
				operation: ['getRetentionData'],
			},
		},
		options: [
			{
				displayName: 'Frequency',
				name: 'frequency',
				type: 'options',
				options: [
					{
						name: 'Day',
						value: 'day',
					},
					{
						name: 'Month',
						value: 'month',
					},
				],
				default: 'day',
				description: 'Granularity of the retention data',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'Start date for retention data',
			},
		],
	},
] as INodeProperties[];
