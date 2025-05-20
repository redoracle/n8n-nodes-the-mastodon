import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { handleApiRequest } from '../Mastodon_Methods';

interface ICredentialAccount {
	id: string;
	username: string;
	acct: string;
	avatar: string;
	header: string;
	[key: string]: any;
}

/**
 * Deletes profile avatar
 * DELETE /api/v1/profile/avatar
 */
export async function deleteAvatar(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<ICredentialAccount> {
	return await handleApiRequest.call(this, 'DELETE', `${baseUrl}/api/v1/profile/avatar`);
}

/**
 * Deletes profile header
 * DELETE /api/v1/profile/header
 */
export async function deleteHeader(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<ICredentialAccount> {
	return await handleApiRequest.call(this, 'DELETE', `${baseUrl}/api/v1/profile/header`);
}
