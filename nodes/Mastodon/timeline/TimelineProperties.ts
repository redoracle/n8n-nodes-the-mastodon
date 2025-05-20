import { INodeProperties } from 'n8n-workflow';

export const timelineOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['timeline'],
			},
		},
		options: [
			{
				name: 'Get Public Timeline',
				value: 'public',
				description: 'Get public timeline',
				action: 'Get public timeline',
			},
			{
				name: 'Get Hashtag Timeline',
				value: 'hashtag',
				description: 'Get hashtag timeline',
				action: 'Get hashtag timeline',
			},
			{
				name: 'Get Home Timeline',
				value: 'home',
				description: 'Get home timeline',
				action: 'Get home timeline',
			},
			{
				name: 'Get List Timeline',
				value: 'list',
				description: 'Get list timeline',
				action: 'Get list timeline',
			},
			{
				name: 'Get Link Timeline',
				value: 'link',
				description: 'Get link timeline',
				action: 'Get link timeline',
			},
		],
		default: 'public',
	},
];

export const timelineFields: INodeProperties[] = [
	{
		displayName: 'Hashtag',
		name: 'hashtag',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['timeline'],
				operation: ['hashtag'],
			},
		},
		default: '',
		description: 'The hashtag to get the timeline for',
	},
	{
		displayName: 'List ID',
		name: 'listId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['timeline'],
				operation: ['list'],
			},
		},
		default: '',
		description: 'The ID of the list to get the timeline for',
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['timeline'],
				operation: ['link'],
			},
		},
		default: '',
		description: 'The URL of the trending article to get the timeline for',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['timeline'],
				operation: ['public', 'hashtag', 'home', 'list', 'link'],
			},
		},
		options: [
			{
				displayName: 'Local Only',
				name: 'local',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						'/operation': ['public', 'hashtag'],
					},
				},
				description: 'Show only local statuses',
			},
			{
				displayName: 'Remote Only',
				name: 'remote',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						'/operation': ['public', 'hashtag'],
					},
				},
				description: 'Show only remote statuses',
			},
			{
				displayName: 'Media Only',
				name: 'only_media',
				type: 'boolean',
				default: false,
				displayOptions: {
					show: {
						'/operation': ['public', 'hashtag'],
					},
				},
				description: 'Show only statuses with media attachments',
			},
			{
				displayName: 'Any Hashtags',
				name: 'any',
				type: 'string',
				typeOptions: {
					multipleValues: true,
				},
				default: [],
				displayOptions: {
					show: {
						'/operation': ['hashtag'],
					},
				},
				description: 'Return statuses that contain any of these additional tags',
			},
			{
				displayName: 'All Hashtags',
				name: 'all',
				type: 'string',
				typeOptions: {
					multipleValues: true,
				},
				default: [],
				displayOptions: {
					show: {
						'/operation': ['hashtag'],
					},
				},
				description: 'Return statuses that contain all of these additional tags',
			},
			{
				displayName: 'None Hashtags',
				name: 'none',
				type: 'string',
				typeOptions: {
					multipleValues: true,
				},
				default: [],
				displayOptions: {
					show: {
						'/operation': ['hashtag'],
					},
				},
				description: 'Return statuses that contain none of these additional tags',
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
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 20,
				description: 'Maximum number of results to return (Max: 40)',
			},
		],
	},
];
