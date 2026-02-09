import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { bindHandleApiRequest } from '../Mastodon_Methods';

interface IScheduledStatus {
	id: string;
	scheduled_at: string;
	params: {
		text: string;
		media_ids: string[] | null;
		poll: IDataObject | null;
		in_reply_to_id: string | null;
		sensitive: boolean;
		spoiler_text: string | null;
		visibility: string;
		language: string | null;
	};
	media_attachments: IDataObject[];
}

/**
 * Lists scheduled statuses
 * GET /api/v1/scheduled_statuses
 */
export async function list(
	this: IExecuteFunctions,
	baseUrl: string,
	_items: INodeExecutionData[],
	i: number,
): Promise<IScheduledStatus[]> {
	const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
	const qs: IDataObject = {};

	if (additionalFields.limit) {
		qs.limit = Math.min(additionalFields.limit as number, 40);
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
	return await apiRequest<IScheduledStatus[]>(
		'GET',
		`${baseUrl}/api/v1/scheduled_statuses`,
		{},
		qs,
	);
}

/**
 * Views a scheduled status
 * GET /api/v1/scheduled_statuses/:id
 */
export async function view(
	this: IExecuteFunctions,
	baseUrl: string,
	_items: INodeExecutionData[],
	i: number,
): Promise<IScheduledStatus> {
	const statusId = this.getNodeParameter('statusId', i) as string;
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<IScheduledStatus>(
		'GET',
		`${baseUrl}/api/v1/scheduled_statuses/${statusId}`,
	);
}

/**
 * Updates a scheduled status
 * PUT /api/v1/scheduled_statuses/:id
 */
export async function update(
	this: IExecuteFunctions,
	baseUrl: string,
	_items: INodeExecutionData[],
	i: number,
): Promise<IScheduledStatus> {
	const statusId = this.getNodeParameter('statusId', i) as string;
	const scheduledAt = this.getNodeParameter('scheduledAt', i) as string;

	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<IScheduledStatus>(
		'PUT',
		`${baseUrl}/api/v1/scheduled_statuses/${statusId}`,
		{
			scheduled_at: scheduledAt,
		},
	);
}

/**
 * Cancels a scheduled status
 * DELETE /api/v1/scheduled_statuses/:id
 */
export async function cancel(
	this: IExecuteFunctions,
	baseUrl: string,
	_items: INodeExecutionData[],
	i: number,
): Promise<IDataObject> {
	const statusId = this.getNodeParameter('statusId', i) as string;
	const apiRequest = bindHandleApiRequest(this);
	await apiRequest<void>('DELETE', `${baseUrl}/api/v1/scheduled_statuses/${statusId}`);
	return {};
}
