// Modularized Blocked Domain properties for Mastodon node
import { INodeProperties } from 'n8n-workflow';

export const blockedDomainOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['blockedDomains'],
			},
		},
		options: [
			{
				name: 'List Blocked Domains',
				value: 'listBlockedDomains',
				description: 'Get a list of blocked domains',
				action: 'List blocked domains',
			},
			{
				name: 'Get Blocked Domain',
				value: 'getBlockedDomain',
				description: 'Get a specific blocked domain by ID',
				action: 'Get a blocked domain',
			},
			{
				name: 'Block Domain',
				value: 'blockDomain',
				description: 'Block a domain from federating',
				action: 'Block a domain',
			},
		],
		default: 'listBlockedDomains',
	},
] as INodeProperties[];

export const blockedDomainFields = [
	{
		displayName: 'Domain ID',
		name: 'domainId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['blockedDomains'],
				operation: ['getBlockedDomain'],
			},
		},
		description: 'The ID of the blocked domain',
	},
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['blockedDomains'],
				operation: ['blockDomain'],
			},
		},
		description: 'The domain to block',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['blockedDomains'],
				operation: ['listBlockedDomains'],
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
	{
		displayName: 'Block Options',
		name: 'blockOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['blockedDomains'],
				operation: ['blockDomain'],
			},
		},
		options: [
			{
				displayName: 'Severity',
				name: 'severity',
				type: 'options',
				options: [
					{
						name: 'No Action',
						value: 'noop',
					},
					{
						name: 'Silence',
						value: 'silence',
					},
					{
						name: 'Suspend',
						value: 'suspend',
					},
				],
				default: 'noop',
				description: 'The severity level of the block',
			},
			{
				displayName: 'Reject Media',
				name: 'reject_media',
				type: 'boolean',
				default: false,
				description: 'Whether to reject media from this domain',
			},
			{
				displayName: 'Reject Reports',
				name: 'reject_reports',
				type: 'boolean',
				default: false,
				description: 'Whether to reject reports from this domain',
			},
			{
				displayName: 'Private Comment',
				name: 'private_comment',
				type: 'string',
				default: '',
				description: 'Private comment about the block',
			},
			{
				displayName: 'Public Comment',
				name: 'public_comment',
				type: 'string',
				default: '',
				description: 'Public comment about the block',
			},
			{
				displayName: 'Obfuscate',
				name: 'obfuscate',
				type: 'boolean',
				default: false,
				description: 'Whether to obfuscate the domain name',
			},
		],
	},
] as INodeProperties[];
