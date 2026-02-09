// Modularized Blocked Domain methods for Mastodon node
import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { bindHandleApiRequest } from '../../Mastodon_Methods';
import { IAdminDomainBlock } from '../../admin/AdminInterfaces';

export async function listBlockedDomains(
	this: IExecuteFunctions,
	baseUrl: string,
	_items: INodeExecutionData[],
	i: number,
): Promise<IAdminDomainBlock[]> {
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
	return await apiRequest<IAdminDomainBlock[]>(
		'GET',
		`${baseUrl}/api/v1/admin/domain_blocks`,
		{},
		qs,
	);
}

export async function getBlockedDomain(
	this: IExecuteFunctions,
	baseUrl: string,
	_items: INodeExecutionData[],
	i: number,
): Promise<IAdminDomainBlock> {
	const domainId = this.getNodeParameter('domainId', i) as string;
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<IAdminDomainBlock>(
		'GET',
		`${baseUrl}/api/v1/admin/domain_blocks/${domainId}`,
	);
}

export async function blockDomain(
	this: IExecuteFunctions,
	baseUrl: string,
	_items: INodeExecutionData[],
	i: number,
): Promise<IAdminDomainBlock> {
	const domain = this.getNodeParameter('domain', i) as string;
	const blockOptions = this.getNodeParameter('blockOptions', i) as IDataObject;

	const body: IDataObject = { domain };

	if (blockOptions.severity) {
		body.severity = blockOptions.severity;
	}
	if (blockOptions.reject_media !== undefined) {
		body.reject_media = blockOptions.reject_media;
	}
	if (blockOptions.reject_reports !== undefined) {
		body.reject_reports = blockOptions.reject_reports;
	}
	if (blockOptions.private_comment) {
		body.private_comment = blockOptions.private_comment;
	}
	if (blockOptions.public_comment) {
		body.public_comment = blockOptions.public_comment;
	}
	if (blockOptions.obfuscate !== undefined) {
		body.obfuscate = blockOptions.obfuscate;
	}

	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<IAdminDomainBlock>('POST', `${baseUrl}/api/v1/admin/domain_blocks`, body);
}
