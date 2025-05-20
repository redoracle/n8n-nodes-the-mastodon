// Modularized oEmbed methods for Mastodon node
import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { handleApiRequest } from '../Mastodon_Methods';

export async function fetchOembed(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
) {
	const url = this.getNodeParameter('url', i) as string;
	return await handleApiRequest.call(this, 'GET', `${baseUrl}/api/oembed`, {}, { url });
}
