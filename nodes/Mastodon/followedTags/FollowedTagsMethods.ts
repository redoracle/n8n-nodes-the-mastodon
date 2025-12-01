import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { bindHandleApiRequest, handleApiRequest } from '../Mastodon_Methods';

/**
 * Gets followed hashtags with pagination support
 * GET /api/v1/followed_tags
 */
export async function list(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IDataObject[]> {
	const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
	const qs: IDataObject = {};

	if (additionalFields.max_id) {
		qs.max_id = additionalFields.max_id;
	}
	if (additionalFields.since_id) {
		qs.since_id = additionalFields.since_id;
	}
	if (additionalFields.limit) {
		qs.limit = additionalFields.limit;
	}

	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest('GET', `${baseUrl}/api/v1/followed_tags`, {}, qs);
}
