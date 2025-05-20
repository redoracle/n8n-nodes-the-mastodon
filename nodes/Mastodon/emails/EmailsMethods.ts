import { IExecuteFunctions } from 'n8n-workflow';
import { handleApiRequest } from '../Mastodon_Methods';

export async function resendConfirmation(this: IExecuteFunctions, baseUrl: string): Promise<any> {
	return await handleApiRequest.call(this, 'POST', `${baseUrl}/api/v1/emails/confirmation`);
}
