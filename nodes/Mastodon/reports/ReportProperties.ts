// Modularized Report properties for Mastodon node
import { INodeProperties } from 'n8n-workflow';

export const reportOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['reports'],
			},
		},
		options: [
			{
				name: 'List Reports',
				value: 'listReports',
				description: 'Get a list of user reports with optional filters',
				action: 'List reports',
			},
			{
				name: 'Resolve Report',
				value: 'resolveReport',
				description: 'Mark a report as resolved',
				action: 'Resolve a report',
			},
			{
				name: 'Create Report',
				value: 'create',
				description: 'File a report against an account',
				action: 'Create a report',
			},
		],
		default: 'listReports',
	},
] as INodeProperties[];

export const reportFields = [
	// Fields for listing reports
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['reports'],
				operation: ['listReports'],
			},
		},
		options: [
			{
				displayName: 'Resolved',
				name: 'resolved',
				type: 'boolean',
				default: false,
				description: 'Filter by resolution status',
			},
			{
				displayName: 'Account ID',
				name: 'account_id',
				type: 'string',
				default: '',
				description: 'Filter by account ID',
			},
			{
				displayName: 'Target Account ID',
				name: 'target_account_id',
				type: 'string',
				default: '',
				description: 'Filter by target account ID',
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 20,
				description: 'Maximum number of results to return',
			},
			{
				displayName: 'Offset',
				name: 'offset',
				type: 'number',
				default: 0,
				description: 'Number of reports to skip before returning results',
			},
		],
	},
	// Fields for resolving a report
	{
		displayName: 'Report ID',
		name: 'reportId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['reports'],
				operation: ['resolveReport'],
			},
		},
		description: 'The ID of the report to resolve',
	},
	// Fields for creating a report
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['reports'],
				operation: ['create'],
			},
		},
		description: 'ID of the account being reported',
	},
	{
		displayName: 'Comment',
		name: 'comment',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['reports'],
				operation: ['create'],
			},
		},
		description: 'Additional information about the report',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['reports'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Status IDs',
				name: 'status_ids',
				type: 'string',
				default: '',
				description: 'Array of status IDs to report (comma-separated)',
			},
			{
				displayName: 'Forward',
				name: 'forward',
				type: 'boolean',
				default: false,
				description: 'Whether to forward the report to the remote instance',
			},
		],
	},
] as INodeProperties[];
