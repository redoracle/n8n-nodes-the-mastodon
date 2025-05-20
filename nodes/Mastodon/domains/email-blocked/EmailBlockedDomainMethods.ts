// Modularized Email Blocked Domain methods for Mastodon node
import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { handleApiRequest } from '../../Mastodon_Methods';
import { IAdminEmailDomainBlock } from '../../admin/AdminInterfaces';

export async function listEmailBlockedDomains(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IAdminEmailDomainBlock[]> {
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

	return await handleApiRequest.call(
		this,
		'GET',
		`${baseUrl}/api/v1/admin/email_domain_blocks`,
		{},
		qs,
	);
}

export async function getEmailBlockedDomain(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IAdminEmailDomainBlock> {
	const domainId = this.getNodeParameter('domainId', i) as string;
	return await handleApiRequest.call(
		this,
		'GET',
		`${baseUrl}/api/v1/admin/email_domain_blocks/${domainId}`,
	);
}

export async function blockEmailDomain(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IAdminEmailDomainBlock> {
	const domain = this.getNodeParameter('domain', i) as string;

	return await handleApiRequest.call(this, 'POST', `${baseUrl}/api/v1/admin/email_domain_blocks`, {
		domain,
	});
}
