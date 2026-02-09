import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { bindHandleApiRequest, handleApiRequest } from '../Mastodon_Methods';
import { IStreamingParams, IStreamingResponse } from './StreamingInterfaces';

/**
 * Stream Public Timeline
 * GET /api/v1/streaming/public
 * Public access
 */
export async function streamPublic(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IStreamingResponse> {
	const additionalFields = this.getNodeParameter('additionalFields', i) as IStreamingParams;
	const qs: IDataObject = {};

	if (additionalFields.local !== undefined) {
		qs.local = additionalFields.local;
	}

	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<IStreamingResponse>('GET', `${baseUrl}/api/v1/streaming/public`, {}, qs, {
		encoding: null,
	});
}

/**
 * Stream Hashtag Timeline
 * GET /api/v1/streaming/hashtag
 * Public access
 */
export async function streamHashtag(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IStreamingResponse> {
	const tag = this.getNodeParameter('tag', i) as string;
	const additionalFields = this.getNodeParameter('additionalFields', i) as IStreamingParams;
	const qs: IDataObject = { tag };

	if (additionalFields.local !== undefined) {
		qs.local = additionalFields.local;
	}

	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<IStreamingResponse>(
		'GET',
		`${baseUrl}/api/v1/streaming/hashtag`,
		{},
		qs,
		{
			encoding: null,
		},
	);
}

/**
 * Stream User Timeline
 * GET /api/v1/streaming/user
 * OAuth Scope: read:statuses
 */
export async function streamUser(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IStreamingResponse> {
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<IStreamingResponse>(
		'GET',
		`${baseUrl}/api/v1/streaming/user`,
		{},
		{},
		{ encoding: null },
	);
}
