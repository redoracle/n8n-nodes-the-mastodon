import { IExecuteFunctions } from 'n8n-workflow';
import { bindHandleApiRequest } from '../Mastodon_Methods';

interface ITag {
	name: string;
	url: string;
	history: Array<{
		day: string;
		uses: string;
		accounts: string;
	}>;
}

/**
 * Gets information about a tag
 * GET /api/v1/tags/:id
 */
export async function get(
	this: IExecuteFunctions,
	baseUrl: string,
	i: number,
): Promise<ITag> {
	const tagId = this.getNodeParameter('tagId', i) as string;
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<ITag>('GET', `${baseUrl}/api/v1/tags/${tagId}`);
}

/**
 * Follows a hashtag
 * POST /api/v1/tags/:id/follow
 */
export async function follow(
	this: IExecuteFunctions,
	baseUrl: string,
	i: number,
): Promise<ITag> {
	const tagId = this.getNodeParameter('tagId', i) as string;
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<ITag>('POST', `${baseUrl}/api/v1/tags/${tagId}/follow`);
}

/**
 * Unfollows a hashtag
 * POST /api/v1/tags/:id/unfollow
 */
export async function unfollow(
	this: IExecuteFunctions,
	baseUrl: string,
	i: number,
): Promise<ITag> {
	const tagId = this.getNodeParameter('tagId', i) as string;
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<ITag>('POST', `${baseUrl}/api/v1/tags/${tagId}/unfollow`);
}
