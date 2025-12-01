import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { bindHandleApiRequest, handleApiRequest } from '../../Mastodon_Methods';
import { IDimension } from '../AdminInterfaces';

export async function listAll(this: IExecuteFunctions, baseUrl: string): Promise<IDimension[]> {
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<IDimension[]>('GET', `${baseUrl}/api/v1/admin/dimensions`);
}

export async function get(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IDimension> {
	const dimensionId = this.getNodeParameter('dimensionId', i) as string;
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<IDimension>('GET', `${baseUrl}/api/v1/admin/dimensions/${dimensionId}`);
}
