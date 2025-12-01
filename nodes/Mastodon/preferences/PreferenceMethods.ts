import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { bindHandleApiRequest, handleApiRequest } from '../Mastodon_Methods';

/**
 * Gets user preferences
 * GET /api/v1/preferences
 */
export async function get(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IDataObject> {
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<IDataObject>('GET', `${baseUrl}/api/v1/preferences`);
}
