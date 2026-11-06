// Modularized Measure properties for Mastodon node
import { INodeProperties } from 'n8n-workflow';

export const measureOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['measures'],
			},
		},
		options: [
			{
				name: 'Get Common Measures',
				value: 'listMeasures',
				description: 'Get the most useful server measures for a date range',
				action: 'List measures',
			},
			{
				name: 'Get Measure by Key',
				value: 'getMeasureMetrics',
				description: 'Get one server measure for a date range',
				action: 'Get measure metrics',
			},
		],
		default: 'listMeasures',
	},
] as INodeProperties[];

export const measureFields = [
	{
		displayName: 'Start Date',
		name: 'start_at',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['measures'],
				operation: ['listMeasures', 'getMeasureMetrics'],
			},
		},
		description: 'Start of the server analytics period',
	},
	{
		displayName: 'End Date',
		name: 'end_at',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['measures'],
				operation: ['listMeasures', 'getMeasureMetrics'],
			},
		},
		description: 'End of the server analytics period',
	},
	{
		displayName: 'Measure Key',
		name: 'measureId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['measures'],
				operation: ['getMeasureMetrics'],
			},
		},
		description: 'Metric key, for example active_users, new_users or interactions',
	},
] as INodeProperties[];
