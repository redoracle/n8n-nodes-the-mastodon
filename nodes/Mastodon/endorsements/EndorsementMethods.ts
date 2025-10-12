import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { handleApiRequest } from '../Mastodon_Methods';
import { IAccount } from '../account/AccountInterfaces';

/**
 * Gets a list of featured accounts
 * GET /api/v1/endorsements
 * OAuth Scope: read:accounts
 */
export async function list(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IAccount[]> {
	return await handleApiRequest.call(this, 'GET', `${baseUrl}/api/v1/endorsements`);
}
