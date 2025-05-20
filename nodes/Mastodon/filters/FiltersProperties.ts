import { INodeProperties } from 'n8n-workflow';

export const filtersOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['filters'],
			},
		},
		options: [
			{
				name: 'Create Filter',
				value: 'create',
				description: 'Create a new content filter',
				action: 'Create a filter',
			},
			{
				name: 'Update Filter',
				value: 'update',
				description: 'Update an existing filter',
				action: 'Update a filter',
			},
			{
				name: 'Delete Filter',
				value: 'delete',
				description: 'Delete a filter',
				action: 'Delete a filter',
			},
		],
		default: 'create',
	},
] as INodeProperties[];

export const filtersFields = [
	// Fields for creating a filter
	{
		displayName: 'Phrase',
		name: 'phrase',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['filters'],
				operation: ['create'],
			},
		},
		description: 'The phrase to filter',
	},
	{
		displayName: 'Context',
		name: 'context',
		type: 'multiOptions',
		required: true,
		default: [],
		displayOptions: {
			show: {
				resource: ['filters'],
				operation: ['create'],
			},
		},
		options: [
			{
				name: 'Home',
				value: 'home',
			},
			{
				name: 'Notifications',
				value: 'notifications',
			},
			{
				name: 'Public',
				value: 'public',
			},
			{
				name: 'Thread',
				value: 'thread',
			},
		],
		description: 'Where to apply the filter',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['filters'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Irreversible',
				name: 'irreversible',
				type: 'boolean',
				default: false,
				description: 'Whether the filter is irreversible',
			},
			{
				displayName: 'Whole Word',
				name: 'whole_word',
				type: 'boolean',
				default: false,
				description: 'Whether to match whole words only',
			},
		],
	},

	// Fields for updating a filter
	{
		displayName: 'Filter ID',
		name: 'filterId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['filters'],
				operation: ['update', 'delete'],
			},
		},
		description: 'The ID of the filter',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['filters'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Phrase',
				name: 'phrase',
				type: 'string',
				default: '',
				description: 'The phrase to filter',
			},
			{
				displayName: 'Context',
				name: 'context',
				type: 'multiOptions',
				default: [],
				options: [
					{
						name: 'Home',
						value: 'home',
					},
					{
						name: 'Notifications',
						value: 'notifications',
					},
					{
						name: 'Public',
						value: 'public',
					},
					{
						name: 'Thread',
						value: 'thread',
					},
				],
				description: 'Where to apply the filter',
			},
			{
				displayName: 'Irreversible',
				name: 'irreversible',
				type: 'boolean',
				default: false,
				description: 'Whether the filter is irreversible',
			},
			{
				displayName: 'Whole Word',
				name: 'whole_word',
				type: 'boolean',
				default: false,
				description: 'Whether to match whole words only',
			},
		],
	},
] as INodeProperties[];
