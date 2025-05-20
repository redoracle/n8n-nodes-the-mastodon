// Modularized oEmbed properties for Mastodon node
import { INodeProperties } from 'n8n-workflow';

export const oembedOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['oembed'],
			},
		},
		options: [
			{
				name: 'Fetch oEmbed Data',
				value: 'fetchOembed',
				description: 'Get oEmbed data for a status URL',
				action: 'Fetch oEmbed data',
			},
		],
		default: 'fetchOembed',
	},
] as INodeProperties[];

export const oembedFields = [
	{
		displayName: 'Status URL',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['oembed'],
				operation: ['fetchOembed'],
			},
		},
		description: 'URL of the status to fetch oEmbed data for',
	},
] as INodeProperties[];
