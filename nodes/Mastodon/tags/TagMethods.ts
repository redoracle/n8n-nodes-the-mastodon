import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { handleApiRequest } from '../Mastodon_Methods';

interface ITag {
	name: string;
	url: string;
	history: {
		day: string;
		uses: string;
		accounts: string;
	}[];
}

/**
 * Gets information about a tag
 * GET /api/v1/tags/:id
 */
export async function get(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<ITag> {
	const tagId = this.getNodeParameter('tagId', i) as string;
	return await handleApiRequest.call(this, 'GET', `${baseUrl}/api/v1/tags/${tagId}`);
}

/**
 * Follows a hashtag
 * POST /api/v1/tags/:id/follow
 */
export async function follow(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<ITag> {
	const tagId = this.getNodeParameter('tagId', i) as string;
	return await handleApiRequest.call(this, 'POST', `${baseUrl}/api/v1/tags/${tagId}/follow`);
}

/**
 * Unfollows a hashtag
 * POST /api/v1/tags/:id/unfollow
 */
export async function unfollow(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<ITag> {
	const tagId = this.getNodeParameter('tagId', i) as string;
	return await handleApiRequest.call(this, 'POST', `${baseUrl}/api/v1/tags/${tagId}/unfollow`);
}
