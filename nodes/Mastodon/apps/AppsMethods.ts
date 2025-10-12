import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { handleApiRequest } from '../Mastodon_Methods';

export async function registerApp(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IDataObject> {
	const clientName = this.getNodeParameter('clientName', i) as string;
	const redirectUris = this.getNodeParameter('redirectUris', i) as string;
	const scopes = this.getNodeParameter('scopes', i) as string;
	const website = this.getNodeParameter('website', i) as string;

	const body: IDataObject = {
		client_name: clientName,
		redirect_uris: redirectUris,
		scopes,
		website,
	};

	return (await handleApiRequest.call(this, 'POST', `${baseUrl}/api/v1/apps`, body)) as IDataObject;
}

export async function verifyAppCredentials(
	this: IExecuteFunctions,
	baseUrl: string,
): Promise<IDataObject> {
	return (await handleApiRequest.call(this, 'GET', `${baseUrl}/api/v1/apps/verify_credentials`)) as IDataObject;
}
