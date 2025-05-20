import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { handleApiRequest } from '../Mastodon_Methods';

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

	const body: { [key: string]: any } = {};
	if (options.notifications !== undefined) {
		body.notifications = options.notifications;
	}
	if (options.duration !== undefined) {
		body.duration = options.duration;
	}

	return await handleApiRequest.call(
		this,
		'POST',
		`${baseUrl}/api/v1/accounts/${accountId}/mute`,
		body,
	);
}

export async function unmute(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
) {
	const accountId = this.getNodeParameter('accountId', i) as string;
	return await handleApiRequest.call(
		this,
		'POST',
		`${baseUrl}/api/v1/accounts/${accountId}/unmute`,
	);
}
