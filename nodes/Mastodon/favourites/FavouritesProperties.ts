import { INodeProperties } from 'n8n-workflow';

export const favouritesOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['favourites'] } },
	options: [
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
	default: 'favourite',
};

export const favouritesFields: INodeProperties[] = [
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
