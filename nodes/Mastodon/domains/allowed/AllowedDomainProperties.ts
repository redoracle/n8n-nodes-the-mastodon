// Modularized Allowed Domain properties for Mastodon node
import { INodeProperties } from 'n8n-workflow';

export const allowedDomainOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['allowedDomains'],
			},
		},
		options: [
			{
				name: 'List Allowed Domains',
				value: 'listAllowedDomains',
				description: 'Get a list of domains allowed to federate',
				action: 'List allowed domains',
			},
			{
				name: 'Get Allowed Domain',
				value: 'getAllowedDomain',
				description: 'Get a specific allowed domain by ID',
				action: 'Get an allowed domain',
			},
		],
		default: 'listAllowedDomains',
	},
] as INodeProperties[];

export const allowedDomainFields = [
	{
		displayName: 'Domain ID',
		name: 'domainId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['allowedDomains'],
				operation: ['getAllowedDomain'],
			},
		},
		description: 'The ID of the allowed domain',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['allowedDomains'],
				operation: ['listAllowedDomains'],
			},
		},
		options: [
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 100,
				description: 'Maximum number of results to return (default 100, max 200)',
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
] as INodeProperties[];
