import { INodeProperties } from 'n8n-workflow';

export const canonicalEmailBlockOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['canonicalEmailBlocks'],
			},
		},
		options: [
			{
				name: 'List Blocks',
				value: 'listBlocks',
				description: 'Get a list of canonical email blocks',
				action: 'List canonical email blocks',
			},
			{
				name: 'Get Block',
				value: 'getBlock',
				description: 'Get a specific canonical email block',
				action: 'Get a canonical email block',
			},
		],
		default: 'listBlocks',
	},
] as INodeProperties[];

export const canonicalEmailBlockFields = [
	{
		displayName: 'Block ID',
		name: 'blockId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['canonicalEmailBlocks'],
				operation: ['getBlock'],
			},
		},
		description: 'The ID of the canonical email block',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['canonicalEmailBlocks'],
				operation: ['listBlocks'],
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
