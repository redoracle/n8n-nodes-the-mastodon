import { INodeProperties } from 'n8n-workflow';

export const markersOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['markers'],
			},
		},
		options: [
			{
				name: 'Get Markers',
				value: 'get',
				description: 'Fetch last read positions in timelines',
				action: 'Get markers',
			},
			{
				name: 'Save Markers',
				value: 'save',
				description: 'Save last read positions in timelines',
				action: 'Save markers',
			},
		],
		default: 'get',
	},
];

export const markersFields: INodeProperties[] = [
	{
		displayName: 'Timeline',
		name: 'timeline',
		type: 'multiOptions',
		displayOptions: {
			show: {
				resource: ['markers'],
				operation: ['get', 'save'],
			},
		},
		options: [
			{
				name: 'Home',
				value: 'home',
			},
			{
				name: 'Notifications',
				value: 'notifications',
			},
		],
		default: [],
		required: true,
		description: 'Timelines to retrieve/save markers for',
	},
	{
		displayName: 'Home Last Read ID',
		name: 'homeLastReadId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['markers'],
				operation: ['save'],
				timeline: ['home'],
			},
		},
		description: 'ID of the last read status in the home timeline',
	},
	{
		displayName: 'Notifications Last Read ID',
		name: 'notificationsLastReadId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['markers'],
				operation: ['save'],
				timeline: ['notifications'],
			},
		},
		description: 'ID of the last read notification',
	},
] as INodeProperties[];
