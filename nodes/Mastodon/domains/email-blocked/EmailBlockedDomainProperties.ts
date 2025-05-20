// Modularized Email Blocked Domain properties for Mastodon node
import { INodeProperties } from 'n8n-workflow';

export const emailBlockedDomainOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['emailBlockedDomains'],
			},
		},
		options: [
			{
				name: 'List Email Blocked Domains',
				value: 'listEmailBlockedDomains',
				description: 'Get a list of email domains blocked from signups',
				action: 'List email blocked domains',
			},
			{
				name: 'Get Email Blocked Domain',
				value: 'getEmailBlockedDomain',
				description: 'Get a specific email blocked domain by ID',
				action: 'Get an email blocked domain',
			},
			{
				name: 'Block Email Domain',
				value: 'blockEmailDomain',
				description: 'Block an email domain from user registration',
				action: 'Block an email domain',
			},
		],
		default: 'listEmailBlockedDomains',
	},
] as INodeProperties[];

export const emailBlockedDomainFields = [
	{
		displayName: 'Domain ID',
		name: 'domainId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['emailBlockedDomains'],
				operation: ['getEmailBlockedDomain'],
			},
		},
		description: 'The ID of the email blocked domain',
	},
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['emailBlockedDomains'],
				operation: ['blockEmailDomain'],
			},
		},
		description: 'The email domain to block from registration',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['emailBlockedDomains'],
				operation: ['listEmailBlockedDomains'],
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
