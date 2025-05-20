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
				name: 'List Measures',
				value: 'listMeasures',
				description: 'Get a list of available measures for metrics',
				action: 'List measures',
			},
			{
				name: 'Get Measure Metrics',
				value: 'getMeasureMetrics',
				description: 'Get metrics for a specific measure',
				action: 'Get measure metrics',
			},
		],
		default: 'listMeasures',
	},
] as INodeProperties[];

export const measureFields = [
	{
		displayName: 'Measure ID',
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
		description: 'The ID of the measure to retrieve metrics for',
	},
] as INodeProperties[];
