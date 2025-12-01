import { INodeProperties } from 'n8n-workflow';

export const bookmarksOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['bookmarks'] } },
	options: [
		{
			name: 'Get Bookmarked Statuses',
			value: 'getBookmarks',
			description: 'Fetch bookmarked statuses',
			action: 'Get bookmarked statuses',
		},
		{
			name: 'Add Bookmark',
			value: 'addBookmark',
			description: 'Bookmark a status',
			action: 'Add bookmark',
		},
		{
			name: 'Remove Bookmark',
			value: 'removeBookmark',
			description: 'Remove bookmark from a status',
			action: 'Remove bookmark',
		},
	],
	default: 'getBookmarks',
};

export const bookmarksFields: INodeProperties[] = [
	// For get
	{
		displayName: 'Max ID',
		name: 'max_id',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['bookmarks'], operation: ['getBookmarks'] } },
		description: 'Return results older than this ID',
	},
	{
		displayName: 'Since ID',
		name: 'since_id',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['bookmarks'], operation: ['getBookmarks'] } },
		description: 'Return results newer than this ID',
	},
	{
		displayName: 'Min ID',
		name: 'min_id',
		type: 'string',
		default: '',
		displayOptions: { show: { resource: ['bookmarks'], operation: ['getBookmarks'] } },
		description: 'Return results immediately newer than this ID',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 20,
		typeOptions: { minValue: 1, maxValue: 40 },
		displayOptions: { show: { resource: ['bookmarks'], operation: ['getBookmarks'] } },
		description: 'Max results to return',
	},
	// For add/remove
	{
		displayName: 'Status ID',
		name: 'statusId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['bookmarks'], operation: ['addBookmark', 'removeBookmark'] },
		},
		description: 'ID of the status to (un)bookmark',
	},
];
