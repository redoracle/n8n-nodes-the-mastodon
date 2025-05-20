// Modularized Timeline methods for Mastodon node
import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { handleApiRequest } from '../Mastodon_Methods';
import { ITimeline, ITimelineParams } from './TimelineInterfaces';

/**
 * Get public timeline
 * GET /api/v1/timelines/public
 */
export async function publicTimeline(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<ITimeline> {
	const additionalFields =
		(this.getNodeParameter('additionalFields', i, {}) as ITimelineParams) || {};
	const qs: IDataObject = {};

	if (additionalFields.local !== undefined) {
		qs.local = additionalFields.local;
	}
	if (additionalFields.remote !== undefined) {
		qs.remote = additionalFields.remote;
	}
	if (additionalFields.only_media !== undefined) {
		qs.only_media = additionalFields.only_media;
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
	if (additionalFields.limit) {
		qs.limit = Math.min(additionalFields.limit, 40);
	}

	return await handleApiRequest.call(this, 'GET', `${baseUrl}/api/v1/timelines/public`, {}, qs);
}

/**
 * Get hashtag timeline
 * GET /api/v1/timelines/tag/:hashtag
 */
export async function hashtagTimeline(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<ITimeline> {
	const hashtag = this.getNodeParameter('hashtag', i) as string;
	const additionalFields =
		(this.getNodeParameter('additionalFields', i, {}) as ITimelineParams) || {};
	const qs: IDataObject = {};

	if (additionalFields.local !== undefined) {
		qs.local = additionalFields.local;
	}
	if (additionalFields.remote !== undefined) {
		qs.remote = additionalFields.remote;
	}
	if (additionalFields.only_media !== undefined) {
		qs.only_media = additionalFields.only_media;
	}
	if (additionalFields.any && additionalFields.any.length > 0) {
		qs.any = additionalFields.any;
	}
	if (additionalFields.all && additionalFields.all.length > 0) {
		qs.all = additionalFields.all;
	}
	if (additionalFields.none && additionalFields.none.length > 0) {
		qs.none = additionalFields.none;
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
	if (additionalFields.limit) {
		qs.limit = Math.min(additionalFields.limit, 40);
	}

	return await handleApiRequest.call(
		this,
		'GET',
		`${baseUrl}/api/v1/timelines/tag/${hashtag}`,
		{},
		qs,
	);
}

/**
 * Get home timeline
 * GET /api/v1/timelines/home
 * OAuth Scope: read:statuses
 */
export async function homeTimeline(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<ITimeline> {
	const additionalFields =
		(this.getNodeParameter('additionalFields', i, {}) as ITimelineParams) || {};
	const qs: IDataObject = {};

	if (additionalFields.max_id) {
		qs.max_id = additionalFields.max_id;
	}
	if (additionalFields.since_id) {
		qs.since_id = additionalFields.since_id;
	}
	if (additionalFields.min_id) {
		qs.min_id = additionalFields.min_id;
	}
	if (additionalFields.limit) {
		qs.limit = Math.min(additionalFields.limit, 40);
	}

	return await handleApiRequest.call(this, 'GET', `${baseUrl}/api/v1/timelines/home`, {}, qs);
}

/**
 * Get list timeline
 * GET /api/v1/timelines/list/:list_id
 * OAuth Scope: read:lists
 */
export async function listTimeline(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<ITimeline> {
	const listId = this.getNodeParameter('listId', i) as string;
	const additionalFields =
		(this.getNodeParameter('additionalFields', i, {}) as ITimelineParams) || {};
	const qs: IDataObject = {};

	if (additionalFields.max_id) {
		qs.max_id = additionalFields.max_id;
	}
	if (additionalFields.since_id) {
		qs.since_id = additionalFields.since_id;
	}
	if (additionalFields.min_id) {
		qs.min_id = additionalFields.min_id;
	}
	if (additionalFields.limit) {
		qs.limit = Math.min(additionalFields.limit, 40);
	}

	return await handleApiRequest.call(
		this,
		'GET',
		`${baseUrl}/api/v1/timelines/list/${listId}`,
		{},
		qs,
	);
}

/**
 * Get link timeline
 * GET /api/v1/timelines/link
 */
export async function linkTimeline(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<ITimeline> {
	const url = this.getNodeParameter('url', i) as string;
	const additionalFields =
		(this.getNodeParameter('additionalFields', i, {}) as ITimelineParams) || {};
	const qs: IDataObject = { url };

	if (additionalFields.max_id) {
		qs.max_id = additionalFields.max_id;
	}
	if (additionalFields.since_id) {
		qs.since_id = additionalFields.since_id;
	}
	if (additionalFields.min_id) {
		qs.min_id = additionalFields.min_id;
	}
	if (additionalFields.limit) {
		qs.limit = Math.min(additionalFields.limit, 40);
	}

	return await handleApiRequest.call(this, 'GET', `${baseUrl}/api/v1/timelines/link`, {}, qs);
}
