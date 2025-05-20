import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { handleApiRequest } from '../Mastodon_Methods';

/**
 * Blocks a domain
 * POST /api/v1/domain_blocks
 */
export async function block(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<{}> {
	const domain = this.getNodeParameter('domain', i) as string;
	return await handleApiRequest.call(this, 'POST', `${baseUrl}/api/v1/domain_blocks`, { domain });
}

/**
 * Unblocks a domain
 * DELETE /api/v1/domain_blocks
 */
export async function unblock(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<{}> {
	const domain = this.getNodeParameter('domain', i) as string;
	return await handleApiRequest.call(this, 'DELETE', `${baseUrl}/api/v1/domain_blocks`, { domain });
}
