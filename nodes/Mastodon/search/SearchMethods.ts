import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { handleApiRequest } from '../Mastodon_Methods';
import { ISearchResults } from './SearchInterfaces';

/**
 * Perform a search
 * GET /api/v2/search
 * OAuth Scope: read:search
 */
export async function search(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<ISearchResults> {
	const query = this.getNodeParameter('query', i) as string;
	const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

	const qs: IDataObject = {
		q: query,
	};

	if (additionalFields.type) {
		qs.type = additionalFields.type as string;
	}
	if (additionalFields.resolve !== undefined) {
		qs.resolve = additionalFields.resolve as boolean;
	}
	if (additionalFields.following !== undefined) {
		qs.following = additionalFields.following as boolean;
	}
	if (additionalFields.account_id) {
		qs.account_id = additionalFields.account_id as string;
	}
	if (additionalFields.exclude_unreviewed !== undefined) {
		qs.exclude_unreviewed = additionalFields.exclude_unreviewed as boolean;
	}
	if (additionalFields.max_id) {
		qs.max_id = additionalFields.max_id as string;
	}
	if (additionalFields.min_id) {
		qs.min_id = additionalFields.min_id as string;
	}
	if (additionalFields.limit) {
		qs.limit = additionalFields.limit as number;
	}

	return await handleApiRequest.call(this, 'GET', `${baseUrl}/api/v2/search`, {}, qs);
}
