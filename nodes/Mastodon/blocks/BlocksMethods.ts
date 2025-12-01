import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { IAccount } from '../account/AccountInterfaces';
import { bindHandleApiRequest, handleApiRequest } from '../Mastodon_Methods';

/**
 * Blocks an account by ID
 */
export async function block(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IDataObject> {
	const accountId = this.getNodeParameter('accountId', i) as string;
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<IDataObject>('POST', `${baseUrl}/api/v1/accounts/${accountId}/block`);
}

/**
 * Unblocks an account by ID
 */
export async function unblock(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IDataObject> {
	const accountId = this.getNodeParameter('accountId', i) as string;
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<IDataObject>('POST', `${baseUrl}/api/v1/accounts/${accountId}/unblock`);
}
