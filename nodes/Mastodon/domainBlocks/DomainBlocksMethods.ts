import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { bindHandleApiRequest, handleApiRequest } from '../Mastodon_Methods';

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
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<{}>('POST', `${baseUrl}/api/v1/domain_blocks`, { domain });
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
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<{}>('DELETE', `${baseUrl}/api/v1/domain_blocks`, { domain });
}
