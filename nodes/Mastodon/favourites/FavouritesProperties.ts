import { INodeProperties } from 'n8n-workflow';

export const favouritesOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['favourites'] } },
	options: [
		{
			name: 'Get Favourites',
			value: 'getFavourites',
			description: 'Get favourited statuses',
			action: 'Get favourites',
		},
		{
			name: 'Favourite',
			value: 'favourite',
			description: 'Add a status to favourites',
			action: 'Favourite status',
		},
		{
			name: 'Unfavourite',
			value: 'unfavourite',
			description: 'Remove a status from favourites',
			action: 'Unfavourite status',
		},
	],
	default: 'getFavourites',
};

export const favouritesFields: INodeProperties[] = [
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 20,
		displayOptions: { show: { resource: ['favourites'], operation: ['getFavourites'] } },
		description: 'Maximum number of results to return',
	},
	{
		displayName: 'Status ID',
		name: 'statusId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['favourites'], operation: ['favourite', 'unfavourite'] } },
		description: 'ID of the status',
	},
];
