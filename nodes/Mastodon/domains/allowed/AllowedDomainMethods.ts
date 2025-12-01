// Modularized Allowed Domain methods for Mastodon node
import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { bindHandleApiRequest, handleApiRequest } from '../../Mastodon_Methods';
import { IAdminDomainAllow } from '../../admin/AdminInterfaces';

export async function listAllowedDomains(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IAdminDomainAllow[]> {
	const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
	const qs: IDataObject = {};

	if (additionalFields.limit) {
		qs.limit = additionalFields.limit;
	}
	if (additionalFields.max_id) {
		qs.max_id = additionalFields.max_id;
	}
	if (additionalFields.since_id) {
		qs.since_id = additionalFields.since_id;
	}
	if (additionalFields.min_id) {
		qs.min_id = additionalFields.min_id;
	}

	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<IAdminDomainAllow[]>('GET', `${baseUrl}/api/v1/admin/domain_allows`, {}, qs);
}

export async function getAllowedDomain(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IAdminDomainAllow> {
	const domainId = this.getNodeParameter('domainId', i) as string;
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<IAdminDomainAllow>('GET', `${baseUrl}/api/v1/admin/domain_allows/${domainId}`);
}
