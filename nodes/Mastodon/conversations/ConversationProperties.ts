import { INodeProperties } from 'n8n-workflow';

export const conversationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['conversations'],
			},
		},
		options: [
			{
				name: 'Get All Conversations',
				value: 'get',
				description: 'Get all conversations',
				action: 'Get all conversations',
			},
			{
				name: 'Remove Conversation',
				value: 'removeConversation',
				description: 'Remove a conversation',
				action: 'Remove a conversation',
			},
			{
				name: 'Mark as Read',
				value: 'markAsRead',
				description: 'Mark a conversation as read',
				action: 'Mark a conversation as read',
			},
		],
		default: 'getConversations',
	},
];

export const conversationFields: INodeProperties[] = [
	{
		displayName: 'Conversation ID',
		name: 'conversationId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['conversations'],
				operation: ['removeConversation', 'markAsRead'],
			},
		},
		default: '',
		description: 'The ID of the conversation',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['conversations'],
				operation: ['getConversations'],
			},
		},
		options: [
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
