import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { bindHandleApiRequest } from '../Mastodon_Methods';
import { IConversation } from './ConversationInterfaces';

/**
 * Get all conversations
 * GET /api/v1/conversations
 * OAuth Scope: read:statuses
 */
export async function get(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IConversation[]> {
	const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
	const qs: IDataObject = {};

	if (additionalFields.max_id) {
		qs.max_id = additionalFields.max_id;
	}
	if (additionalFields.since_id) {
		qs.since_id = additionalFields.since_id;
	}
	if (additionalFields.min_id) {
		qs.min_id = additionalFields.min_id;
	}
	if (additionalFields.limit) {
		qs.limit = Math.min(additionalFields.limit as number, 40);
	}

	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<IConversation[]>('GET', `${baseUrl}/api/v1/conversations`, {}, qs);
}

/**
 * Remove conversation
 * DELETE /api/v1/conversations/:id
 * OAuth Scope: write:conversations
 */
export async function removeConversation(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<{}> {
	const conversationId = this.getNodeParameter('conversationId', i) as string;
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<{}>('DELETE', `${baseUrl}/api/v1/conversations/${conversationId}`);
}

/**
 * Mark conversation as read
 * POST /api/v1/conversations/:id/read
 * OAuth Scope: write:conversations
 */
export async function markAsRead(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<{}> {
	const conversationId = this.getNodeParameter('conversationId', i) as string;
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<{}>('POST', `${baseUrl}/api/v1/conversations/${conversationId}/read`);
}
