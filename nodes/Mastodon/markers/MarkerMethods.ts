import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { handleApiRequest } from '../Mastodon_Methods';
import { IMarkerResponse, IMarkerParams, IMarkerPayload } from './MarkerInterfaces';

/**
 * Retrieve Markers
 * GET /api/v1/markers
 * OAuth Scope: read:statuses
 */
export async function getMarkers(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IMarkerResponse> {
	const timelines = this.getNodeParameter('timeline', i) as string[];
	const params: IMarkerParams = {
		timeline: timelines,
	};

	return await handleApiRequest.call(
		this,
		'GET',
		`${baseUrl}/api/v1/markers`,
		{},
		params as unknown as IDataObject,
	);
}

/**
 * Save Markers
 * POST /api/v1/markers
 * OAuth Scope: write:statuses
 */
export async function saveMarkers(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IMarkerResponse> {
	const body: IMarkerPayload = {};
	const homeLastReadId = this.getNodeParameter('homeLastReadId', i, undefined);
	const notificationsLastReadId = this.getNodeParameter('notificationsLastReadId', i, undefined);

	if (homeLastReadId) {
		body['home[last_read_id]'] = homeLastReadId as string;
	}
	if (notificationsLastReadId) {
		body['notifications[last_read_id]'] = notificationsLastReadId as string;
	}

	return await handleApiRequest.call(
		this,
		'POST',
		`${baseUrl}/api/v1/markers`,
		body as IDataObject,
	);
}
