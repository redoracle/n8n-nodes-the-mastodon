import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	NodeOperationError,
} from 'n8n-workflow';
import { handleApiRequest } from '../Mastodon_Methods';

export async function getBookmarks(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IDataObject[]> {
	const qs: IDataObject = {};
	const maxId = this.getNodeParameter('max_id', i, '') as string;
	const sinceId = this.getNodeParameter('since_id', i, '') as string;
	const minId = this.getNodeParameter('min_id', i, '') as string;
	const limit = this.getNodeParameter('limit', i, 20) as number;

	if (maxId) qs.max_id = maxId;
	if (sinceId) qs.since_id = sinceId;
	if (minId) qs.min_id = minId;
	if (limit) qs.limit = Math.min(limit, 40);

	return (await handleApiRequest.call(this, 'GET', `${baseUrl}/api/v1/bookmarks`, {}, qs)) as IDataObject[];
}

export async function addBookmark(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
	): Promise<IDataObject[]> {
	const statusId = this.getNodeParameter('statusId', i) as string;
	if (!statusId) {
		throw new NodeOperationError(this.getNode(), 'Status ID is required to add a bookmark');
	}
	return [(await handleApiRequest.call(
		this,
		'POST',
		`${baseUrl}/api/v1/statuses/${statusId}/bookmark`,
	)) as IDataObject];
}

export async function removeBookmark(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
	): Promise<IDataObject[]> {
	const statusId = this.getNodeParameter('statusId', i) as string;
	if (!statusId) {
		throw new NodeOperationError(this.getNode(), 'Status ID is required to remove a bookmark');
	}
	return [(await handleApiRequest.call(
		this,
		'POST',
		`${baseUrl}/api/v1/statuses/${statusId}/unbookmark`,
	)) as IDataObject];
}
