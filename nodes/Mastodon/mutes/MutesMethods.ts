import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { bindHandleApiRequest, handleApiRequest } from '../Mastodon_Methods';

export async function mute(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
) {
	const accountId = this.getNodeParameter('accountId', i) as string;
	const options = this.getNodeParameter('options', i, {}) as {
		notifications?: boolean;
		duration?: number;
	};

	const body: IDataObject = {};
	if (options.notifications !== undefined) {
		body.notifications = options.notifications;
	}
	if (options.duration !== undefined) {
		body.duration = options.duration;
	}

	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest('POST', `${baseUrl}/api/v1/accounts/${accountId}/mute`, body);
}

export async function unmute(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
) {
	const accountId = this.getNodeParameter('accountId', i) as string;
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest('POST', `${baseUrl}/api/v1/accounts/${accountId}/unmute`);
}
