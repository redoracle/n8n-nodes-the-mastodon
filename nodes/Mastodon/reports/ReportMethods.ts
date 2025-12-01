// Modularized Report methods for Mastodon node
import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { bindHandleApiRequest, handleApiRequest } from '../Mastodon_Methods';

export async function listReports(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
) {
	const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
	const qs: IDataObject = {};

	if (additionalFields.resolved !== undefined) {
		qs.resolved = additionalFields.resolved;
	}
	if (additionalFields.account_id) {
		qs.account_id = additionalFields.account_id;
	}
	if (additionalFields.target_account_id) {
		qs.target_account_id = additionalFields.target_account_id;
	}
	if (additionalFields.limit) {
		qs.limit = additionalFields.limit;
	}
	if (additionalFields.offset) {
		qs.offset = additionalFields.offset;
	}

	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<IDataObject[]>('GET', `${baseUrl}/api/v1/admin/reports`, {}, qs);
}

export async function resolveReport(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
) {
	const reportId = this.getNodeParameter('reportId', i) as string;
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<IDataObject>(
		'POST',
		`${baseUrl}/api/v1/admin/reports/${reportId}/resolve`,
	);
}

/**
 * Create a report
 * POST /api/v1/reports
 */
export async function create(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IDataObject> {
	const accountId = this.getNodeParameter('accountId', i) as string;
	const comment = this.getNodeParameter('comment', i) as string;
	const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

	const body: IDataObject = {
		account_id: accountId,
		comment,
	};

	if (additionalFields.status_ids) {
		body.status_ids = additionalFields.status_ids;
	}

	if (additionalFields.forward !== undefined) {
		body.forward = additionalFields.forward as boolean;
	}

	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<IDataObject>('POST', `${baseUrl}/api/v1/reports`, body);
}
