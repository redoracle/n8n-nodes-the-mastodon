// Modularized Account methods for Mastodon node
import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	NodeOperationError,
} from 'n8n-workflow';
import { handleApiRequest } from '../Mastodon_Methods';
import { IAccount, IAccountWarning, IAdminAccount } from './AccountInterfaces';

export async function follow(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
	i: number,
): Promise<IAccount[]> {
	const accountId = this.getNodeParameter('accountId', i) as string;
	if (!accountId) {
		throw new NodeOperationError(this.getNode(), 'Account ID is required to follow');
	}
	const result = await handleApiRequest.call(this, 'POST', `/api/v1/accounts/${accountId}/follow`);
	return [result as IAccount];
}

export async function unfollow(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
	i: number,
): Promise<IAccount[]> {
	const accountId = this.getNodeParameter('accountId', i) as string;
	if (!accountId) {
		throw new NodeOperationError(this.getNode(), 'Account ID is required to unfollow');
	}
	const result = await handleApiRequest.call(
		this,
		'POST',
		`/api/v1/accounts/${accountId}/unfollow`,
	);
	return [result as IAccount];
}

export async function block(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
	i: number,
): Promise<IAccount> {
	const accountId = this.getNodeParameter('accountId', i) as string;
	console.log('Executing block method with accountId:', accountId);
	return (await handleApiRequest.call(this, 'POST', `/api/v1/accounts/${accountId}/block`)) as IAccount;
}

export async function mute(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
	i: number,
): Promise<IAccount> {
	const accountId = this.getNodeParameter('accountId', i) as string;
	const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
	console.log(
		'Executing mute method with accountId:',
		accountId,
		'and additionalFields:',
		additionalFields,
	);

	const body: IDataObject = {};
	if (additionalFields.notifications !== undefined) {
		body.notifications = additionalFields.notifications as boolean;
	}
	if (additionalFields.duration !== undefined) {
		body.duration = additionalFields.duration as number;
	}

	return (await handleApiRequest.call(this, 'POST', `/api/v1/accounts/${accountId}/mute`, body)) as IAccount;
}

export async function verifyCredentials(this: IExecuteFunctions): Promise<IAccount> {
	console.log('Executing verifyCredentials method');
	return (await handleApiRequest.call(this, 'GET', `/api/v1/accounts/verify_credentials`)) as IAccount;
}

export async function viewProfile(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
	i: number,
): Promise<IAccount> {
	const accountId = this.getNodeParameter('accountId', i) as string;
	const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
	const qs: IDataObject = {};
	if (additionalFields.with_relationships !== undefined) {
		qs.with_relationships = additionalFields.with_relationships;
	}
	console.log('Executing viewProfile method with accountId:', accountId, 'and qs:', qs);
	return await handleApiRequest.call(this, 'GET', `/api/v1/accounts/${accountId}`, {}, qs);
}

export async function getAccountWarnings(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
	i: number,
): Promise<IAccountWarning[]> {
	const accountId = this.getNodeParameter('accountId', i) as string;
	console.log('Executing getAccountWarnings method with accountId:', accountId);
	return await handleApiRequest.call(this, 'GET', `/api/v1/admin/accounts/${accountId}/warnings`);
}

export async function getAdminAccountInfo(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
	i: number,
): Promise<IAdminAccount> {
	const accountId = this.getNodeParameter('accountId', i) as string;
	console.log('Executing getAdminAccountInfo method with accountId:', accountId);
	return await handleApiRequest.call(this, 'GET', `/api/v1/admin/accounts/${accountId}`);
}

export async function addNoteToAccount(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
	i: number,
): Promise<IAccount> {
	const accountId = this.getNodeParameter('accountId', i) as string;
	const note = this.getNodeParameter('note', i) as string;
	console.log('Executing addNoteToAccount method with accountId:', accountId, 'and note:', note);
	return await handleApiRequest.call(this, 'POST', `/api/v1/accounts/${accountId}/note`, { note });
}

export async function getAccountFollowers(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
	i: number,
): Promise<IAccount[]> {
	const accountId = this.getNodeParameter('accountId', i) as string;
	console.log('Executing getAccountFollowers method with accountId:', accountId);
	return await handleApiRequest.call(this, 'GET', `/api/v1/accounts/${accountId}/followers`);
}

export async function getAccountFollowing(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
	i: number,
): Promise<IAccount[]> {
	const accountId = this.getNodeParameter('accountId', i) as string;
	console.log('Executing getAccountFollowing method with accountId:', accountId);
	return await handleApiRequest.call(this, 'GET', `/api/v1/accounts/${accountId}/following`);
}

export async function getAccountFeaturedTags(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
	i: number,
): Promise<IDataObject[]> {
	const accountId = this.getNodeParameter('accountId', i) as string;
	console.log('Executing getAccountFeaturedTags method with accountId:', accountId);
	return await handleApiRequest.call(this, 'GET', `/api/v1/accounts/${accountId}/featured_tags`);
}

export async function getAccountLists(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
	i: number,
): Promise<IDataObject[]> {
	const accountId = this.getNodeParameter('accountId', i) as string;
	console.log('Executing getAccountLists method with accountId:', accountId);
	return await handleApiRequest.call(this, 'GET', `/api/v1/accounts/${accountId}/lists`);
}

export async function getAccountStatuses(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
	i: number,
): Promise<IDataObject[]> {
	const accountId = this.getNodeParameter('accountId', i) as string;
	console.log('Executing getAccountStatuses method with accountId:', accountId);
	return await handleApiRequest.call(this, 'GET', `/api/v1/accounts/${accountId}/statuses`);
}

export async function pinAccount(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
	i: number,
): Promise<IAccount> {
	const accountId = this.getNodeParameter('accountId', i) as string;
	console.log('Executing pinAccount method with accountId:', accountId);
	return await handleApiRequest.call(this, 'POST', `/api/v1/accounts/${accountId}/pin`);
}

export async function removeAccountFromFollowers(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
	i: number,
): Promise<IAccount> {
	const accountId = this.getNodeParameter('accountId', i) as string;
	console.log('Executing removeAccountFromFollowers method with accountId:', accountId);
	return await handleApiRequest.call(
		this,
		'POST',
		`/api/v1/accounts/${accountId}/remove_from_followers`,
	);
}

export async function searchAccounts(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
	i: number,
): Promise<IAccount[]> {
	const query = this.getNodeParameter('query', i) as string;
	const limit = this.getNodeParameter('limit', i) as number;
	console.log('Executing searchAccounts method with query:', query, 'and limit:', limit);
	return await handleApiRequest.call(
		this,
		'GET',
		`/api/v1/accounts/search`,
		{},
		{ q: query, limit },
	);
}

export async function unmuteAccount(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
	i: number,
): Promise<IAccount> {
	const accountId = this.getNodeParameter('accountId', i) as string;
	console.log('Executing unmuteAccount method with accountId:', accountId);
	return await handleApiRequest.call(this, 'POST', `/api/v1/accounts/${accountId}/unmute`);
}

export async function unpinAccount(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
	i: number,
): Promise<IAccount> {
	const accountId = this.getNodeParameter('accountId', i) as string;
	console.log('Executing unpinAccount method with accountId:', accountId);
	return await handleApiRequest.call(this, 'POST', `/api/v1/accounts/${accountId}/unpin`);
}

// Register an account
export async function registerAccount(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
	i: number,
): Promise<IDataObject> {
	const username = this.getNodeParameter('username', i) as string;
	const email = this.getNodeParameter('email', i) as string;
	const password = this.getNodeParameter('password', i) as string;
	const agreement = this.getNodeParameter('agreement', i) as boolean;
	const locale = this.getNodeParameter('locale', i) as string;
	const reason = this.getNodeParameter('reason', i, undefined) as string | undefined;
	const dateOfBirth = this.getNodeParameter('date_of_birth', i, undefined) as string | undefined;
	const body: IDataObject = { username, email, password, agreement, locale };
	if (reason) body.reason = reason;
	if (dateOfBirth) body.date_of_birth = dateOfBirth;
	return (await handleApiRequest.call(this, 'POST', '/api/v1/accounts', body)) as IDataObject;
}

// Update account credentials
export async function updateCredentials(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
	i: number,
): Promise<IAccount> {
	const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
	const body: IDataObject = { ...additionalFields };
	// Handle avatar/header as binary if provided (n8n-specific, not implemented here)
	return await handleApiRequest.call(this, 'PATCH', '/api/v1/accounts/update_credentials', body);
}

// Get multiple accounts
export async function getMultipleAccounts(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
	i: number,
): Promise<IAccount[]> {
	const ids = this.getNodeParameter('ids', i) as string[];
	return await handleApiRequest.call(this, 'GET', '/api/v1/accounts', {}, { id: ids });
}

// Check relationships to other accounts
export async function getRelationships(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
	i: number,
): Promise<IDataObject[]> {
	const ids = this.getNodeParameter('ids', i) as string[];
	const withSuspended = this.getNodeParameter('with_suspended', i, false) as boolean;
	const qs: IDataObject = { id: ids };
	if (withSuspended) qs.with_suspended = true;
	return await handleApiRequest.call(this, 'GET', '/api/v1/accounts/relationships', {}, qs);
}

// Find familiar followers
export async function getFamiliarFollowers(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
	i: number,
): Promise<IDataObject[]> {
	const ids = this.getNodeParameter('ids', i) as string[];
	return await handleApiRequest.call(
		this,
		'GET',
		'/api/v1/accounts/familiar_followers',
		{},
		{ id: ids },
	);
}

// Lookup account ID from Webfinger address
export async function lookupAccount(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
	i: number,
): Promise<IAccount> {
	const acct = this.getNodeParameter('acct', i) as string;
	return await handleApiRequest.call(this, 'GET', '/api/v1/accounts/lookup', {}, { acct });
}
