import { INodeProperties } from 'n8n-workflow';

export const mutesOperations = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['mutes'],
		},
	},
	options: [
		{
			name: 'Mute Account',
			value: 'mute',
			description: 'Mute an account',
			action: 'Mute an account',
		},
		{
			name: 'Unmute Account',
			value: 'unmute',
			description: 'Unmute an account',
			action: 'Unmute an account',
		},
	],
	default: 'mute',
} as INodeProperties;

export const mutesFields = [
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['mutes'],
				operation: ['mute', 'unmute'],
			},
		},
		description: 'ID of the account to mute/unmute',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['mutes'],
				operation: ['mute'],
			},
		},
		options: [
			{
				displayName: 'Mute Notifications',
				name: 'notifications',
				type: 'boolean',
				default: true,
				description: 'Whether to mute notifications from the account as well',
			},
			{
				displayName: 'Duration',
				name: 'duration',
				type: 'number',
				default: 0,
				description: 'Number of seconds to mute for. 0 means indefinite.',
			},
		],
	},
] as INodeProperties[];
