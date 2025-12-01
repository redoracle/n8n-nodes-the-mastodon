import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { bindHandleApiRequest } from '../Mastodon_Methods';
import { IAccount } from '../account/AccountInterfaces';

/**
 * Gets a list of featured accounts
 * GET /api/v1/endorsements
 * OAuth Scope: read:accounts
 */
export async function get(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IAccount[]> {
	const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
	const qs: IDataObject = {};

	if (additionalFields.max_id) {
		qs.max_id = additionalFields.max_id as string;
	}
	if (additionalFields.since_id) {
		qs.since_id = additionalFields.since_id as string;
	}
	if (additionalFields.limit) {
		qs.limit = additionalFields.limit as number;
	}

	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<IAccount[]>('GET', `${baseUrl}/api/v1/endorsements`, {}, qs);
}
