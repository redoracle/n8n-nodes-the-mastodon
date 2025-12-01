import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { bindHandleApiRequest, handleApiRequest } from '../Mastodon_Methods';
import { IAccount } from '../account/AccountInterfaces';

/**
 * View accounts in directory
 * GET /api/v1/directory
 */
export async function view(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IAccount[]> {
	const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
	const qs: IDataObject = {};

	if (additionalFields.limit) {
		qs.limit = Math.min(additionalFields.limit as number, 80);
	}
	if (additionalFields.offset) {
		qs.offset = additionalFields.offset;
	}
	if (additionalFields.order) {
		qs.order = additionalFields.order;
	}
	if (additionalFields.local !== undefined) {
		qs.local = additionalFields.local;
	}

	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<IAccount[]>('GET', `${baseUrl}/api/v1/directory`, {}, qs);
}
