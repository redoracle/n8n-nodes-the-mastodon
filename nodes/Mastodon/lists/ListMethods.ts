import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { handleApiRequest } from '../Mastodon_Methods';
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
	const result = await handleApiRequest.call(this, 'GET', `${baseUrl}/api/v1/lists`);
	return Array.isArray(result) ? result : [result];
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
	const result = await handleApiRequest.call(this, 'GET', `${baseUrl}/api/v1/lists/${listId}`);
	return Array.isArray(result) ? result : [result];
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
	const replies_policy = this.getNodeParameter('replies_policy', i, undefined) as
		| string
		| undefined;
	const exclusive = this.getNodeParameter('exclusive', i, undefined) as boolean | undefined;

	const body: IDataObject = { title };
	if (replies_policy) body.replies_policy = replies_policy;
	if (exclusive !== undefined) body.exclusive = exclusive;

	const result = await handleApiRequest.call(this, 'POST', `${baseUrl}/api/v1/lists`, body);
	return Array.isArray(result) ? result : [result];
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
	const replies_policy = this.getNodeParameter('replies_policy', i, undefined) as
		| string
		| undefined;
	const exclusive = this.getNodeParameter('exclusive', i, undefined) as boolean | undefined;

	const body: IDataObject = { title };
	if (replies_policy) body.replies_policy = replies_policy;
	if (exclusive !== undefined) body.exclusive = exclusive;

	const result = await handleApiRequest.call(
		this,
		'PUT',
		`${baseUrl}/api/v1/lists/${listId}`,
		body,
	);
	return Array.isArray(result) ? result : [result];
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
): Promise<{}[]> {
	const listId = this.getNodeParameter('listId', i) as string;
	const result = await handleApiRequest.call(this, 'DELETE', `${baseUrl}/api/v1/lists/${listId}`);
	return Array.isArray(result) ? result : [result];
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
	const max_id = this.getNodeParameter('max_id', i, undefined) as string | undefined;
	const since_id = this.getNodeParameter('since_id', i, undefined) as string | undefined;
	const min_id = this.getNodeParameter('min_id', i, undefined) as string | undefined;
	const limit = this.getNodeParameter('limit', i, undefined) as number | undefined;
	const qs: IDataObject = {};
	if (max_id) qs.max_id = max_id;
	if (since_id) qs.since_id = since_id;
	if (min_id) qs.min_id = min_id;
	if (limit !== undefined) qs.limit = limit;
	return await handleApiRequest.call(
		this,
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
	return await handleApiRequest.call(this, 'POST', `${baseUrl}/api/v1/lists/${listId}/accounts`, {
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
	return await handleApiRequest.call(this, 'DELETE', `${baseUrl}/api/v1/lists/${listId}/accounts`, {
		account_ids: accountIds,
	});
}
