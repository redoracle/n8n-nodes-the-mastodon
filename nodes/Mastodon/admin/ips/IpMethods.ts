import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { handleApiRequest } from '../../Mastodon_Methods';
import { IAdminIp } from '../AdminInterfaces';

export async function listIps(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IAdminIp[]> {
	const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
	const qs: IDataObject = {};
	if (additionalFields.limit) qs.limit = additionalFields.limit;
	if (additionalFields.max_id) qs.max_id = additionalFields.max_id;
	if (additionalFields.since_id) qs.since_id = additionalFields.since_id;
	if (additionalFields.min_id) qs.min_id = additionalFields.min_id;
	return await handleApiRequest.call(this, 'GET', `${baseUrl}/api/v1/admin/ips`, {}, qs);
}

export async function getIp(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IAdminIp> {
	const ipRecordId = this.getNodeParameter('ipRecordId', i) as string;
	return await handleApiRequest.call(this, 'GET', `${baseUrl}/api/v1/admin/ips/${ipRecordId}`);
}
