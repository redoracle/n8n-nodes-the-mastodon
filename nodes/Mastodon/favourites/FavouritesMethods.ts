import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { bindHandleApiRequest } from '../Mastodon_Methods';

export async function getFavourites(
	this: IExecuteFunctions,
	baseUrl: string,
	_items: INodeExecutionData[],
	i: number,
) {
	const limit = this.getNodeParameter('limit', i, 20) as number;
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest('GET', `${baseUrl}/api/v1/favourites`, { limit });
}

export async function favourite(
	this: IExecuteFunctions,
	baseUrl: string,
	_items: INodeExecutionData[],
	i: number,
) {
	const statusId = this.getNodeParameter('statusId', i) as string;
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest('POST', `${baseUrl}/api/v1/statuses/${statusId}/favourite`);
}

export async function unfavourite(
	this: IExecuteFunctions,
	baseUrl: string,
	_items: INodeExecutionData[],
	i: number,
) {
	const statusId = this.getNodeParameter('statusId', i) as string;
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest('POST', `${baseUrl}/api/v1/statuses/${statusId}/unfavourite`);
}
