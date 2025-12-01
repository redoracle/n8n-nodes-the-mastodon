import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { bindHandleApiRequest, handleApiRequest } from '../Mastodon_Methods';
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
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<IInstance>('GET', `${baseUrl}/api/v2/instance`);
}
