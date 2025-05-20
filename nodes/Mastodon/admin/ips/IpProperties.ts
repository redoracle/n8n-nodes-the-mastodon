import { INodeProperties } from 'n8n-workflow';

export const ipOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['ips'] } },
		options: [
			{
				name: 'List IPs',
				value: 'listIps',
				description: 'List IP records',
				action: 'List IP records',
			},
			{
				name: 'Get IP',
				value: 'getIp',
				description: 'Get a single IP record by ID',
				action: 'Get an IP record',
			},
		],
		default: 'listIps',
	},
] as INodeProperties[];

export const ipFields = [
	{
		displayName: 'Record ID',
		name: 'ipRecordId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['ips'], operation: ['getIp'] } },
		description: 'ID of the IP record',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['ips'], operation: ['listIps'] } },
		options: [
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 100,
				description: 'Max results to return (default 100, max 200)',
			},
			{
				displayName: 'Max ID',
				name: 'max_id',
				type: 'string',
				default: '',
				description: 'Return results older than this ID',
			},
			{
				displayName: 'Since ID',
				name: 'since_id',
				type: 'string',
				default: '',
				description: 'Return results newer than this ID',
			},
			{
				displayName: 'Min ID',
				name: 'min_id',
				type: 'string',
				default: '',
				description: 'Return results immediately newer than this ID',
			},
		],
	},
] as INodeProperties[];
