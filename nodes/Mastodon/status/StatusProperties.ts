// Modularized Status properties for Mastodon node
import { INodeProperties } from 'n8n-workflow';

export const statusOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['status'],
		},
	},
	options: [
		{
			name: 'Create Status',
			value: 'create',
			description: 'Create a new status',
			action: 'Create a status',
		},
		{
			name: 'Delete Status',
			value: 'delete',
			description: 'Delete a status',
			action: 'Delete a status',
		},
		{
			name: 'Edit Status',
			value: 'edit',
			description: 'Edit an existing status',
			action: 'Edit a status',
		},
		{
			name: 'View Status',
			value: 'view',
			description: 'View status details',
			action: 'View a status',
		},
		{
			name: 'Get Context',
			value: 'context',
			description: 'Get a status’s context (original and all replies)',
			action: 'Get status context',
		},
	],
	default: 'create',
};

export const createFields: INodeProperties[] = [
	{
		displayName: 'Status Text',
		name: 'status',
		type: 'string',
		required: true,
		default: '',
		description: 'The text content of the status',
		displayOptions: {
			show: {
				resource: ['status'],
				operation: ['create'],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['status'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Media IDs',
				name: 'mediaIds',
				type: 'string',
				default: '',
				description: 'Comma-separated list of media IDs to attach to the status',
			},
			{
				displayName: 'In Reply To ID',
				name: 'inReplyToId',
				type: 'string',
				default: '',
				description: 'ID of the status being replied to',
			},
			{
				displayName: 'Sensitive',
				name: 'sensitive',
				type: 'boolean',
				default: false,
				description: 'Mark status and attached media as sensitive',
			},
			{
				displayName: 'Spoiler Text',
				name: 'spoilerText',
				type: 'string',
				default: '',
				description: 'Text to be shown as a warning or subject before the actual content',
			},
			{
				displayName: 'Visibility',
				name: 'visibility',
				type: 'options',
				options: [
					{
						name: 'Public',
						value: 'public',
					},
					{
						name: 'Unlisted',
						value: 'unlisted',
					},
					{
						name: 'Private',
						value: 'private',
					},
					{
						name: 'Direct',
						value: 'direct',
					},
				],
				default: 'public',
				description: 'Visibility of the status',
			},
		],
	},
];

export const deleteFields: INodeProperties[] = [
	{
		displayName: 'Status ID',
		name: 'statusId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the status to delete',
		displayOptions: {
			show: {
				resource: ['status'],
				operation: ['delete'],
			},
		},
	},
];

export const searchFields: INodeProperties[] = [
	{
		displayName: 'Search Query',
		name: 'query',
		type: 'string',
		required: true,
		default: '',
		description: 'Search query',
		displayOptions: {
			show: {
				resource: ['status'],
				operation: ['search'],
			},
		},
	},
];

export const favouriteFields: INodeProperties[] = [
	{
		displayName: 'Status ID',
		name: 'statusId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the status to favourite/unfavourite',
		displayOptions: {
			show: {
				resource: ['status'],
				operation: ['favourite', 'unfavourite'],
			},
		},
	},
];

export const boostFields: INodeProperties[] = [
	{
		displayName: 'Status ID',
		name: 'statusId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the status to boost/unboost',
		displayOptions: {
			show: {
				resource: ['status'],
				operation: ['boost', 'unboost'],
			},
		},
	},
];

export const mediaUploadFields: INodeProperties[] = [
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		description: 'The name of the binary property containing the file to be uploaded',
		displayOptions: {
			show: {
				resource: ['status'],
				operation: ['mediaUpload'],
			},
		},
	},
];

export const statusExtraFields: INodeProperties[] = [
	{
		displayName: 'Status ID',
		name: 'statusId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the status to view',
		displayOptions: {
			show: {
				resource: ['status'],
				operation: ['view'],
			},
		},
	},
];

export const scheduledStatusesFields: INodeProperties[] = [
	{
		displayName: 'Schedule At',
		name: 'scheduledAt',
		type: 'string',
		required: true,
		default: '',
		description: 'ISO 8601 Datetime when the status will be published',
		placeholder: '2025-06-01T12:00:00Z',
		displayOptions: {
			show: {
				resource: ['status'],
				operation: ['scheduleStatus'],
			},
		},
	},
];

export const editFields: INodeProperties[] = [
	{
		displayName: 'Status ID',
		name: 'statusId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the status to edit',
		displayOptions: {
			show: {
				resource: ['status'],
				operation: ['edit'],
			},
		},
	},
	{
		displayName: 'Status Text',
		name: 'status',
		type: 'string',
		required: true,
		default: '',
		description: 'The new text content of the status',
		displayOptions: {
			show: {
				resource: ['status'],
				operation: ['edit'],
			},
		},
	},
];

// Fields for context operation
export const contextFields: INodeProperties[] = [
	{
		displayName: 'Status ID',
		name: 'statusId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID of the status to retrieve its full thread context',
		displayOptions: {
			show: {
				resource: ['status'],
				operation: ['context'],
			},
		},
	},
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['status'],
				operation: ['context'],
			},
		},
		options: [
			{
				displayName: 'Include Private Statuses',
				name: 'includePrivate',
				type: 'boolean',
				default: true,
				description:
					'Whether to include private statuses in the context (requires read:statuses scope)',
			},
			{
				displayName: 'Max Depth',
				name: 'maxDepth',
				type: 'number',
				default: 20,
				description: 'Maximum depth of reply threads to retrieve (unlimited when authenticated)',
			},
			{
				displayName: 'Return Format',
				name: 'returnFormat',
				type: 'options',
				default: 'structured',
				options: [
					{
						name: 'Structured (Ancestors/Descendants)',
						value: 'structured',
						description: 'Return ancestors and descendants as separate arrays',
					},
					{
						name: 'Flat Thread',
						value: 'flat',
						description: 'Return all statuses in chronological order as a flat array',
					},
					{
						name: 'Tree Structure',
						value: 'tree',
						description: 'Return statuses organized as a nested thread tree',
					},
				],
				description: 'How to format the returned conversation data',
			},
		],
	},
];

// Removed the duplicate operation menu (statusExtraOperations) to avoid confusion
// Ensure only one operation menu is displayed for the "Status" resource

// Removed the export of statusExtraOperations
// Updated the statusProperties array to exclude statusExtraOperations
export const statusProperties: INodeProperties[] = [
	statusOperations,
	...createFields,
	...deleteFields,
	...searchFields,
	...favouriteFields,
	...boostFields,
	...mediaUploadFields,
	...scheduledStatusesFields,
	...statusExtraFields,
	...editFields,
	...contextFields,
];
