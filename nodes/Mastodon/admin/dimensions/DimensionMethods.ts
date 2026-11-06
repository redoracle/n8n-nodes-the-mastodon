import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import { bindHandleApiRequest } from '../../Mastodon_Methods';
import { IDimension } from '../AdminInterfaces';

// Dimensions that can be queried without a tag ID or remote-domain context.
const COMMON_DIMENSIONS = ['languages', 'sources', 'servers', 'space_usage', 'software_versions'];

export async function listAll(
	this: IExecuteFunctions,
	baseUrl: string,
	_items: INodeExecutionData[],
	_i: number,
): Promise<IDimension[]> {
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<IDimension[]>('POST', `${baseUrl}/api/v1/admin/dimensions`, {
		keys: COMMON_DIMENSIONS,
	});
}

export async function get(
	this: IExecuteFunctions,
	baseUrl: string,
	_items: INodeExecutionData[],
	i: number,
): Promise<IDimension> {
	const key = this.getNodeParameter('dimensionId', i) as string;
	if (!key?.trim()) {
		throw new NodeOperationError(this.getNode(), 'Dimension Key is required');
	}
	const apiRequest = bindHandleApiRequest(this);
	const response = await apiRequest<IDimension[]>('POST', `${baseUrl}/api/v1/admin/dimensions`, {
		keys: [key],
	});
	if (Array.isArray(response)) {
		if (response.length === 0) {
			throw new NodeOperationError(this.getNode(), `No dimension found for key "${key}"`);
		}
		return response[0];
	}
	return response;
}
