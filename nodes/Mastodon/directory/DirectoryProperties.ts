import { INodeProperties } from 'n8n-workflow';

export const directoryOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['directory'],
		},
	},
	options: [
		{
			name: 'View',
			value: 'view',
			description: 'View accounts in directory',
			action: 'View directory accounts',
		},
	],
	default: 'view',
};

export const directoryFields: INodeProperties[] = [
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['directory'],
				operation: ['view'],
			},
		},
		options: [
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 40,
				description: 'Maximum number of results to return (max: 80)',
			},
			{
				displayName: 'Offset',
				name: 'offset',
				type: 'number',
				default: 0,
				description: 'Number of accounts to skip before returning results',
			},
			{
				displayName: 'Order',
				name: 'order',
				type: 'options',
				options: [
					{
						name: 'Active',
						value: 'active',
						description: 'Order by activity',
					},
					{
						name: 'New',
						value: 'new',
						description: 'Order by new accounts',
					},
				],
				default: 'active',
				description: 'Order of results',
			},
			{
				displayName: 'Local Only',
				name: 'local',
				type: 'boolean',
				default: false,
				description: 'Return only local accounts',
			},
		],
	},
];

export interface IDirectoryParams {
	limit?: number;
	offset?: number;
	order?: 'active' | 'new';
	local?: boolean;
	[key: string]: any;
}
