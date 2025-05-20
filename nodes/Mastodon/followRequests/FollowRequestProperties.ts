import { INodeProperties } from 'n8n-workflow';

export const followRequestOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['followRequests'],
			},
		},
		options: [
			{
				name: 'Get Follow Requests',
				value: 'list',
				description: 'Get a list of pending follow requests',
				action: 'Get follow requests',
			},
			{
				name: 'Authorize Follow Request',
				value: 'authorize',
				description: 'Authorize a follow request',
				action: 'Authorize a follow request',
			},
			{
				name: 'Reject Follow Request',
				value: 'reject',
				description: 'Reject a follow request',
				action: 'Reject a follow request',
			},
		],
		default: 'list',
	},
] as INodeProperties[];

export const followRequestFields = [
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['followRequests'],
				operation: ['authorize', 'reject'],
			},
		},
		description: 'The ID of the account requesting to follow',
	},
] as INodeProperties[];
