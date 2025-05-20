// Modularized Retention methods for Mastodon node
import { IExecuteFunctions } from 'n8n-workflow';
import { handleApiRequest } from '../Mastodon_Methods';

export async function viewStatistics(this: IExecuteFunctions, baseUrl: string) {
	return await handleApiRequest.call(this, 'GET', `${baseUrl}/api/v1/admin/retention`);
}
