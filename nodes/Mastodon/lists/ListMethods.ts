import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { bindHandleApiRequest, handleApiRequest } from '../Mastodon_Methods';
import { IList } from './ListInterfaces';

/**
 * View all lists
 * GET /api/v1/lists
 * OAuth Scope: read:lists
 */
export async function getLists(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IList[]> {
	const apiRequest = bindHandleApiRequest(this);
	const result = await apiRequest<IList | IList[]>('GET', `${baseUrl}/api/v1/lists`);
	return Array.isArray(result) ? result : [result as IList];
}

/**
 * Get a specific list
 * GET /api/v1/lists/:id
 * OAuth Scope: read:lists
 */
export async function getList(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IList[]> {
	const listId = this.getNodeParameter('listId', i) as string;
	const apiRequest = bindHandleApiRequest(this);
	const result = await apiRequest<IList | IList[]>('GET', `${baseUrl}/api/v1/lists/${listId}`);
	return Array.isArray(result) ? result : [result as IList];
}

/**
 * Create a new list
 * POST /api/v1/lists
 * OAuth Scope: write:lists
 */
export async function createList(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IList[]> {
	const title = this.getNodeParameter('title', i) as string;
	const repliesPolicy = this.getNodeParameter('replies_policy', i, undefined) as string | undefined;
	const exclusive = this.getNodeParameter('exclusive', i, undefined) as boolean | undefined;

	const body: IDataObject = { title };
	if (repliesPolicy) body.replies_policy = repliesPolicy;
	if (exclusive !== undefined) body.exclusive = exclusive;

	const apiRequest = bindHandleApiRequest(this);
	const result = await apiRequest<IList | IList[]>('POST', `${baseUrl}/api/v1/lists`, body);
	return Array.isArray(result) ? result : [result as IList];
}

/**
 * Update a list
 * PUT /api/v1/lists/:id
 * OAuth Scope: write:lists
 */
export async function updateList(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IList[]> {
	const listId = this.getNodeParameter('listId', i) as string;
	const title = this.getNodeParameter('title', i) as string;
	const repliesPolicy = this.getNodeParameter('replies_policy', i, undefined) as string | undefined;
	const exclusive = this.getNodeParameter('exclusive', i, undefined) as boolean | undefined;

	const body: IDataObject = { title };
	if (repliesPolicy) body.replies_policy = repliesPolicy;
	if (exclusive !== undefined) body.exclusive = exclusive;

	const apiRequest = bindHandleApiRequest(this);
	const result = await apiRequest<IList | IList[]>(
		'PUT',
		`${baseUrl}/api/v1/lists/${listId}`,
		body,
	);
	return Array.isArray(result) ? result : [result as IList];
}

/**
 * Delete a list
 * DELETE /api/v1/lists/:id
 * OAuth Scope: write:lists
 */
export async function deleteList(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<Array<{}>> {
	const listId = this.getNodeParameter('listId', i) as string;
	const apiRequest = bindHandleApiRequest(this);
	const result = await apiRequest<{} | Array<{}>>('DELETE', `${baseUrl}/api/v1/lists/${listId}`);
	return Array.isArray(result) ? result : [result as {}];
}

/**
 * View accounts in a list
 * GET /api/v1/lists/:id/accounts
 * OAuth Scope: read:lists
 */
export async function getAccountsInList(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IDataObject[]> {
	const listId = this.getNodeParameter('listId', i) as string;
	const maxId = this.getNodeParameter('max_id', i, undefined) as string | undefined;
	const sinceId = this.getNodeParameter('since_id', i, undefined) as string | undefined;
	const minId = this.getNodeParameter('min_id', i, undefined) as string | undefined;
	const limit = this.getNodeParameter('limit', i, undefined) as number | undefined;
	const qs: IDataObject = {};
	if (maxId) qs.max_id = maxId;
	if (sinceId) qs.since_id = sinceId;
	if (minId) qs.min_id = minId;
	if (limit !== undefined) qs.limit = limit;
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<IDataObject[]>(
		'GET',
		`${baseUrl}/api/v1/lists/${listId}/accounts`,
		{},
		qs,
	);
}

/**
 * Add accounts to a list
 * POST /api/v1/lists/:id/accounts
 * OAuth Scope: write:lists
 */
export async function addAccountsToList(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<{}> {
	const listId = this.getNodeParameter('listId', i) as string;
	let accountIds = this.getNodeParameter('accountIds', i) as string[] | string;
	if (typeof accountIds === 'string') {
		accountIds = accountIds
			.split(',')
			.map((id) => id.trim())
			.filter(Boolean);
	}
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<{}>('POST', `${baseUrl}/api/v1/lists/${listId}/accounts`, {
		account_ids: accountIds,
	});
}

/**
 * Remove accounts from a list
 * DELETE /api/v1/lists/:id/accounts
 * OAuth Scope: write:lists
 */
export async function removeAccountsFromList(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<{}> {
	const listId = this.getNodeParameter('listId', i) as string;
	let accountIds = this.getNodeParameter('accountIds', i) as string[] | string;
	if (typeof accountIds === 'string') {
		accountIds = accountIds
			.split(',')
			.map((id) => id.trim())
			.filter(Boolean);
	}
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<{}>('DELETE', `${baseUrl}/api/v1/lists/${listId}/accounts`, {
		account_ids: accountIds,
	});
}
