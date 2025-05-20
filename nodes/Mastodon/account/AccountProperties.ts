// Modularized Account properties for Mastodon node
import { INodeProperties } from 'n8n-workflow';

export const accountOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['account'],
		},
	},
	options: [
		{
			name: 'Add Note to Account',
			value: 'addNoteToAccount',
			description: 'Add a note to an account',
			action: 'Add note to account',
		},
		{
			name: 'Get Account Followers',
			value: 'getAccountFollowers',
			description: 'Get followers of an account',
			action: 'Get account followers',
		},
		{
			name: 'Get Account Following',
			value: 'getAccountFollowing',
			description: 'Get accounts followed by an account',
			action: 'Get account following',
		},
		{
			name: 'Get Account Lists',
			value: 'getAccountLists',
			description: 'Get lists containing an account',
			action: 'Get account lists',
		},
		{
			name: 'Get Account Statuses',
			value: 'getAccountStatuses',
			description: 'Get statuses of an account',
			action: 'Get account statuses',
		},
		{
			name: 'Get Featured Tags',
			value: 'getAccountFeaturedTags',
			description: 'Get featured tags of an account',
			action: 'Get featured tags',
		},
		{
			name: 'Pin Account',
			value: 'pinAccount',
			description: 'Pin an account',
			action: 'Pin account',
		},
		{
			name: 'Remove Account from Followers',
			value: 'removeAccountFromFollowers',
			description: 'Remove an account from followers',
			action: 'Remove account from followers',
		},
		{
			name: 'Search Accounts',
			value: 'searchAccounts',
			description: 'Search for accounts',
			action: 'Search accounts',
		},
		{
			name: 'Unmute Account',
			value: 'unmuteAccount',
			description: 'Unmute an account',
			action: 'Unmute account',
		},
		{
			name: 'Unpin Account',
			value: 'unpinAccount',
			description: 'Unpin an account',
			action: 'Unpin account',
		},
		{
			name: 'Verify Credentials',
			value: 'verifyCredentials',
			description: 'Get current account details',
			action: 'Verify credentials',
		},
		{
			name: 'View User Profile',
			value: 'viewProfile',
			description: 'View user profile by ID',
			action: 'View user profile',
		},
	].sort((a, b) => b.name.localeCompare(a.name)),
	default: 'viewProfile',
};

export const accountFields: INodeProperties[] = [
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: [
					'viewProfile',
					'getAccountWarnings',
					'getAdminAccountInfo',
					'addNoteToAccount',
					'getAccountFollowers',
					'getAccountFollowing',
					'getAccountLists',
					'getAccountStatuses',
					'getAccountFeaturedTags',
					'pinAccount',
					'removeAccountFromFollowers',
					'unmuteAccount',
					'unpinAccount',
				],
			},
		},
		description: 'ID of the account',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['viewProfile'],
			},
		},
		options: [
			{
				displayName: 'With Relationships',
				name: 'with_relationships',
				type: 'boolean',
				default: false,
				description: 'Include relationships info with account',
			},
		],
	},
	{
		displayName: 'Note',
		name: 'note',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['addNoteToAccount'],
			},
		},
		description: 'Note to add to the account',
	},
	{
		displayName: 'Query',
		name: 'query',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['searchAccounts'],
			},
		},
		description: 'Search query for accounts',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 10,
		displayOptions: {
			show: {
				resource: ['account'],
				operation: ['searchAccounts'],
			},
		},
		description: 'Maximum number of accounts to return',
	},
];
