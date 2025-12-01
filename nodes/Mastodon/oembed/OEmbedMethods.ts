// Modularized oEmbed methods for Mastodon node
import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { bindHandleApiRequest, handleApiRequest } from '../Mastodon_Methods';

export async function fetchOembed(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
) {
	const url = this.getNodeParameter('url', i) as string;
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest('GET', `${baseUrl}/api/oembed`, {}, { url });
}
