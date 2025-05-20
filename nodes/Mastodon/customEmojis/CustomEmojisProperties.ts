import { INodeProperties } from 'n8n-workflow';

export const customEmojisOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['customEmojis'],
		},
	},
	options: [
		{
			name: 'List',
			value: 'list',
			description: 'Get list of custom emojis',
			action: 'List custom emojis',
		},
	],
	default: 'list',
};

// No additional fields needed for custom emojis as it's a simple GET request
export const customEmojisFields: INodeProperties[] = [];
