import { INodeProperties } from 'n8n-workflow';

export const suggestionOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['suggestions'],
			},
		},
		options: [
			{
				name: 'Get Suggestions',
				value: 'get',
				description: 'Get follow suggestions',
				action: 'Get suggestions',
			},
			{
				name: 'Remove Suggestion',
				value: 'remove',
				description: 'Remove an account from suggestions',
				action: 'Remove a suggestion',
			},
		],
		default: 'get',
	},
] as INodeProperties[];

export const suggestionFields = [
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['suggestions'],
				operation: ['remove'],
			},
		},
		description: 'ID of the account to remove from suggestions',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['suggestions'],
				operation: ['get'],
			},
		},
		options: [
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 40,
				typeOptions: {
					minValue: 1,
					maxValue: 80,
				},
				description: 'Maximum number of results to return (max: 80)',
			},
		],
	},
] as INodeProperties[];
