import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { bindHandleApiRequest, handleApiRequest } from '../Mastodon_Methods';
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
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<IAccount[]>('GET', `${baseUrl}/api/v1/follow_requests`);
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
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<IRelationship>(
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
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<IRelationship>(
		'POST',
		`${baseUrl}/api/v1/follow_requests/${accountId}/reject`,
	);
}
