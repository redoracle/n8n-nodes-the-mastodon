import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { handleApiRequest } from '../Mastodon_Methods';

/**
 * Gets user preferences
 * GET /api/v1/preferences
 */
export async function get(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<any> {
	return await handleApiRequest.call(this, 'GET', `${baseUrl}/api/v1/preferences`);
}
