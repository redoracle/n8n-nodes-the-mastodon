import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { bindHandleApiRequest } from '../Mastodon_Methods';

/**
 * Gets follow suggestions
 * GET /api/v2/suggestions
 */
export async function get(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IDataObject[]> {
	const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
	const qs: IDataObject = {};

	if (additionalFields.limit) {
		qs.limit = Math.min(additionalFields.limit as number, 80);
	}

	const apiRequest = bindHandleApiRequest(this);
	const result = await apiRequest('GET', `${baseUrl}/api/v2/suggestions`, {}, qs);
	return Array.isArray(result) ? result : result ? [result] : [];
}

/**
 * Removes a suggestion
 * DELETE /api/v1/suggestions/:account_id
 */
export async function remove(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<{}> {
	const accountId = this.getNodeParameter('accountId', i) as string;
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest('DELETE', `${baseUrl}/api/v1/suggestions/${accountId}`);
}
