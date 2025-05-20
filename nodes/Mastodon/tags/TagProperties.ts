import { INodeProperties } from 'n8n-workflow';

export const tagOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['tags'],
			},
		},
		options: [
			{
				name: 'Get Tag Information',
				value: 'get',
				description: 'Get information about a hashtag',
				action: 'Get tag information',
			},
			{
				name: 'Follow Tag',
				value: 'follow',
				description: 'Follow a hashtag',
				action: 'Follow a tag',
			},
			{
				name: 'Unfollow Tag',
				value: 'unfollow',
				description: 'Unfollow a hashtag',
				action: 'Unfollow a tag',
			},
		],
		default: 'get',
	},
] as INodeProperties[];

export const tagFields = [
	{
		displayName: 'Tag ID',
		name: 'tagId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['tags'],
				operation: ['get', 'follow', 'unfollow'],
			},
		},
		description: 'The hashtag to interact with (without the #)',
	},
] as INodeProperties[];
