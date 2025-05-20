import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { handleApiRequest } from '../Mastodon_Methods';
import { IInstance } from './InstanceInterfaces';

/**
 * Get server information
 * GET /api/v2/instance
 */
export async function getServerInfo(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IInstance> {
	return await handleApiRequest.call(this, 'GET', `${baseUrl}/api/v2/instance`);
}
