import { INodeProperties } from 'n8n-workflow';

export const domainBlocksOperations = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['domainBlocks'] } },
	options: [
		{
			name: 'Block Domain',
			value: 'block',
			description: 'Block a domain',
			action: 'Block a domain',
		},
		{
			name: 'Unblock Domain',
			value: 'unblock',
			description: 'Unblock a domain',
			action: 'Unblock a domain',
		},
	],
	default: 'block',
} as INodeProperties;

export const domainBlocksFields = [
	{
		displayName: 'Domain',
		name: 'domain',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['domainBlocks'], operation: ['block', 'unblock'] } },
		description: 'The domain to block or unblock',
	},
] as INodeProperties[];
