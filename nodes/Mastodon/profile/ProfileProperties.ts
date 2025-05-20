import { INodeProperties } from 'n8n-workflow';

export const profileOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['profile'],
			},
		},
		options: [
			{
				name: 'Delete Avatar',
				value: 'deleteAvatar',
				description: 'Delete profile avatar',
				action: 'Delete avatar',
			},
			{
				name: 'Delete Header',
				value: 'deleteHeader',
				description: 'Delete profile header',
				action: 'Delete header',
			},
		],
		default: 'deleteAvatar',
	},
] as INodeProperties[];

export const profileFields = [] as INodeProperties[];
