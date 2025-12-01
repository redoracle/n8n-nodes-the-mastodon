import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { bindHandleApiRequest, handleApiRequest } from '../Mastodon_Methods';

export async function resendConfirmation(
	this: IExecuteFunctions,
	baseUrl: string,
): Promise<IDataObject> {
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest('POST', `${baseUrl}/api/v1/emails/confirmation`);
}
