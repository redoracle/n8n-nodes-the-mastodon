import { INodeProperties } from 'n8n-workflow';

export const mediaOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['media'],
			},
		},
		options: [
			{
				name: 'Upload Media',
				value: 'upload',
				description: 'Upload a new media file',
				action: 'Upload media',
			},
			{
				name: 'Update Media',
				value: 'update',
				description: 'Update media metadata',
				action: 'Update media',
			},
		],
		default: 'upload',
	},
] as INodeProperties[];

export const mediaFields = [
	// Fields for uploading media
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		required: true,
		default: 'data',
		displayOptions: {
			show: {
				resource: ['media'],
				operation: ['upload'],
			},
		},
		description: 'Name of the binary property containing the file to be uploaded',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['media'],
				operation: ['upload'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'A text description of the media for accessibility',
			},
			{
				displayName: 'Focus',
				name: 'focus',
				type: 'string',
				default: '',
				description: 'Two floating points between -1.0 and 1.0 (x,y)',
				placeholder: '0.0,0.0',
			},
		],
	},

	// Fields for updating media
	{
		displayName: 'Media ID',
		name: 'mediaId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['media'],
				operation: ['update'],
			},
		},
		description: 'ID of the media to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['media'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'A text description of the media for accessibility',
			},
			{
				displayName: 'Focus',
				name: 'focus',
				type: 'string',
				default: '',
				description: 'Two floating points between -1.0 and 1.0 (x,y)',
				placeholder: '0.0,0.0',
			},
		],
	},
] as INodeProperties[];
