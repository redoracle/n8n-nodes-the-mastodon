import { INodeProperties } from 'n8n-workflow';

export const blocksOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['blocks'] } },
	options: [
		{
			name: 'Block Account',
			value: 'block',
			description: 'Block an account',
			action: 'Block an account',
		},
		{
			name: 'Unblock Account',
			value: 'unblock',
			description: 'Unblock an account',
			action: 'Unblock an account',
		},
	],
	default: 'block',
};

export const blocksFields: INodeProperties[] = [
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['blocks'], operation: ['block', 'unblock'] } },
		description: 'ID of the account to block/unblock',
	},
];
