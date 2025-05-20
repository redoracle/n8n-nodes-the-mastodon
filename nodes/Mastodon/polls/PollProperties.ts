import { INodeProperties } from 'n8n-workflow';

export const pollOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['polls'],
			},
		},
		options: [
			{
				name: 'View Poll',
				value: 'view',
				description: 'Get information about a poll',
				action: 'View a poll',
			},
			{
				name: 'Vote on Poll',
				value: 'vote',
				description: 'Vote on a poll',
				action: 'Vote on a poll',
			},
		],
		default: 'view',
	},
] as INodeProperties[];

export const pollFields = [
	// Fields for viewing/voting on a poll
	{
		displayName: 'Poll ID',
		name: 'pollId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['polls'],
				operation: ['view', 'vote'],
			},
		},
		description: 'ID of the poll to interact with',
	},
	// Fields for voting
	{
		displayName: 'Choices',
		name: 'choices',
		type: 'number[]',
		required: true,
		default: [],
		displayOptions: {
			show: {
				resource: ['polls'],
				operation: ['vote'],
			},
		},
		description: 'Array of chosen options (zero-based index)',
	},
] as INodeProperties[];
