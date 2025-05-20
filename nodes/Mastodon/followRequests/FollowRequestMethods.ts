import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { handleApiRequest } from '../Mastodon_Methods';
import { IAccount } from '../account/AccountInterfaces';
import { IRelationship } from '../relationship/RelationshipInterfaces';

/**
 * Gets a list of pending follow requests
 * GET /api/v1/follow_requests
 * OAuth Scope: read:follows
 */
export async function list(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IAccount[]> {
	return await handleApiRequest.call(this, 'GET', `${baseUrl}/api/v1/follow_requests`);
}

/**
 * Authorizes a follow request
 * POST /api/v1/follow_requests/:id/authorize
 * OAuth Scope: write:follows
 */
export async function acceptRequest(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IRelationship> {
	const accountId = this.getNodeParameter('accountId', i) as string;
	return await handleApiRequest.call(
		this,
		'POST',
		`${baseUrl}/api/v1/follow_requests/${accountId}/authorize`,
	);
}

/**
 * Rejects a follow request
 * POST /api/v1/follow_requests/:id/reject
 * OAuth Scope: write:follows
 */
export async function rejectRequest(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IRelationship> {
	const accountId = this.getNodeParameter('accountId', i) as string;
	return await handleApiRequest.call(
		this,
		'POST',
		`${baseUrl}/api/v1/follow_requests/${accountId}/reject`,
	);
}
