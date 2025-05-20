import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { handleApiRequest } from '../Mastodon_Methods';

/**
 * Blocks an account by ID
 */
export async function block(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<any> {
	const accountId = this.getNodeParameter('accountId', i) as string;
	return await handleApiRequest.call(this, 'POST', `${baseUrl}/api/v1/accounts/${accountId}/block`);
}

/**
 * Unblocks an account by ID
 */
export async function unblock(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<any> {
	const accountId = this.getNodeParameter('accountId', i) as string;
	return await handleApiRequest.call(
		this,
		'POST',
		`${baseUrl}/api/v1/accounts/${accountId}/unblock`,
	);
}
