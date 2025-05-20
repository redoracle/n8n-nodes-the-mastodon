import { INodeProperties } from 'n8n-workflow';

export const announcementOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['announcements'],
		},
	},
	options: [
		{
			name: 'List',
			value: 'list',
			description: 'Get list of active announcements',
			action: 'List announcements',
		},
	],
	default: 'list',
};

// No additional fields needed for announcements as it's a simple GET request
export const announcementFields: INodeProperties[] = [];
