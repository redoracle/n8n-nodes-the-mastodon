import { INodeProperties } from 'n8n-workflow';

export const listOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['lists'],
			},
		},
		options: [
			{
				name: 'Get Lists',
				value: 'getLists',
				description: 'Get all lists',
				action: 'Get all lists',
			},
			{
				name: 'Get List',
				value: 'getList',
				description: 'Get a specific list',
				action: 'Get a specific list',
			},
			{
				name: 'Create List',
				value: 'createList',
				description: 'Create a new list',
				action: 'Create a new list',
			},
			{
				name: 'Update List',
				value: 'updateList',
				description: 'Update an existing list',
				action: 'Update an existing list',
			},
			{
				name: 'Delete List',
				value: 'deleteList',
				description: 'Delete a list',
				action: 'Delete a list',
			},
			{
				name: 'Get Accounts in List',
				value: 'getAccountsInList',
				description: 'View accounts in a list',
				action: 'View accounts in a list',
			},
			{
				name: 'Add Accounts to List',
				value: 'addAccountsToList',
				description: 'Add accounts to a list',
				action: 'Add accounts to a list',
			},
			{
				name: 'Remove Accounts from List',
				value: 'removeAccountsFromList',
				description: 'Remove accounts from a list',
				action: 'Remove accounts from a list',
			},
		],
		default: 'getLists',
	},
];

export const listFields: INodeProperties[] = [
	{
		displayName: 'List ID',
		name: 'listId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['lists'],
				operation: [
					'getList',
					'updateList',
					'deleteList',
					'getAccountsInList',
					'addAccountsToList',
					'removeAccountsFromList',
				],
			},
		},
		default: '',
		description: 'The ID of the list',
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['lists'],
				operation: ['createList', 'updateList'],
			},
		},
		default: '',
		description: 'The title of the list',
	},
	{
		displayName: 'Replies Policy',
		name: 'replies_policy',
		type: 'options',
		options: [
			{ name: 'Followed', value: 'followed' },
			{ name: 'List', value: 'list' },
			{ name: 'None', value: 'none' },
		],
		default: 'list',
		required: false,
		displayOptions: {
			show: {
				resource: ['lists'],
				operation: ['createList', 'updateList'],
			},
		},
		description: 'Which replies to show within the list',
	},
	{
		displayName: 'Exclusive',
		name: 'exclusive',
		type: 'boolean',
		default: false,
		required: false,
		displayOptions: {
			show: {
				resource: ['lists'],
				operation: ['createList', 'updateList'],
			},
		},
		description: 'Whether members of this list are removed from the Home feed',
	},
	{
		displayName: 'Account IDs',
		name: 'accountIds',
		type: 'string',
		typeOptions: {
			multipleValues: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['lists'],
				operation: ['addAccountsToList', 'removeAccountsFromList'],
			},
		},
		default: '',
		description: 'The IDs of the accounts to add or remove',
	},
	{
		displayName: 'Max ID',
		name: 'max_id',
		type: 'string',
		required: false,
		displayOptions: {
			show: {
				resource: ['lists'],
				operation: ['getAccountsInList'],
			},
		},
		default: '',
		description: 'Return results older than this ID',
	},
	{
		displayName: 'Since ID',
		name: 'since_id',
		type: 'string',
		required: false,
		displayOptions: {
			show: {
				resource: ['lists'],
				operation: ['getAccountsInList'],
			},
		},
		default: '',
		description: 'Return results newer than this ID',
	},
	{
		displayName: 'Min ID',
		name: 'min_id',
		type: 'string',
		required: false,
		displayOptions: {
			show: {
				resource: ['lists'],
				operation: ['getAccountsInList'],
			},
		},
		default: '',
		description: 'Return results immediately newer than this ID',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 0,
			maxValue: 80,
		},
		required: false,
		displayOptions: {
			show: {
				resource: ['lists'],
				operation: ['getAccountsInList'],
			},
		},
		default: 40,
		description: 'Maximum number of results (max 80, 0 for all)',
	},
];
