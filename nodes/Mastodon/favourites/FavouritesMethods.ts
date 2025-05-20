import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { handleApiRequest } from '../Mastodon_Methods';

export async function favourite(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
) {
	const statusId = this.getNodeParameter('statusId', i) as string;
	return handleApiRequest.call(this, 'POST', `${baseUrl}/api/v1/statuses/${statusId}/favourite`);
}

export async function unfavourite(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
) {
	const statusId = this.getNodeParameter('statusId', i) as string;
	return handleApiRequest.call(this, 'POST', `${baseUrl}/api/v1/statuses/${statusId}/unfavourite`);
}
