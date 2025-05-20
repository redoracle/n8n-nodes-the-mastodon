import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { handleApiRequest } from '../Mastodon_Methods';

/**
 * Gets followed hashtags with pagination support
 * GET /api/v1/followed_tags
 */
export async function list(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<any> {
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

	return await handleApiRequest.call(this, 'GET', `${baseUrl}/api/v1/followed_tags`, {}, qs);
}
