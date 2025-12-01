import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { bindHandleApiRequest } from '../Mastodon_Methods';

interface ICredentialAccount {
	id: string;
	username: string;
	acct: string;
	avatar: string;
	header: string;
	// Additional dynamic fields returned by the API live here to avoid widening declared keys
	additionalFields?: Record<string, IDataObject | string | number | boolean | null | undefined>;
}

/**
 * Deletes profile avatar
 * DELETE /api/v1/profile/avatar
 */
export async function deleteAvatar(
	this: IExecuteFunctions,
	baseUrl: string,
): Promise<ICredentialAccount> {
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<ICredentialAccount>('DELETE', `${baseUrl}/api/v1/profile/avatar`);
}

/**
 * Deletes profile header
 * DELETE /api/v1/profile/header
 */
export async function deleteHeader(
	this: IExecuteFunctions,
	baseUrl: string,
): Promise<ICredentialAccount> {
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<ICredentialAccount>('DELETE', `${baseUrl}/api/v1/profile/header`);
}
