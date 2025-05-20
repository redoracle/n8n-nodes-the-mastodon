import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { handleApiRequest } from '../Mastodon_Methods';

/**
 * Gets follow suggestions
 * GET /api/v2/suggestions
 */
export async function get(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<any> {
	const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
	const qs: IDataObject = {};

	if (additionalFields.limit) {
		qs.limit = Math.min(additionalFields.limit as number, 80);
	}

	return await handleApiRequest.call(this, 'GET', `${baseUrl}/api/v2/suggestions`, {}, qs);
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
	return await handleApiRequest.call(this, 'DELETE', `${baseUrl}/api/v1/suggestions/${accountId}`);
}
