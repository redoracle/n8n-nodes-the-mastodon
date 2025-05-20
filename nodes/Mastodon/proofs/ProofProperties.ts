// Modularized Proof properties for Mastodon node
import { INodeProperties } from 'n8n-workflow';

export const proofOperations = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['proofs'],
			},
		},
		options: [
			{
				name: 'List Identity Proofs',
				value: 'listProofs',
				description: 'Get a list of identity proofs for the authenticated user',
				action: 'List identity proofs',
			},
		],
		default: 'listProofs',
	},
] as INodeProperties[];

// No additional fields needed for proofs operations
export const proofFields = [] as INodeProperties[];
