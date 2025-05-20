import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { handleApiRequest } from '../Mastodon_Methods';
import { IFeaturedTag } from './FeaturedTagInterfaces';

/**
 * Gets a list of featured tags
 * GET /api/v1/featured_tags
 * OAuth Scope: read:accounts
 */
export async function list(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IFeaturedTag[]> {
	return await handleApiRequest.call(this, 'GET', `${baseUrl}/api/v1/featured_tags`);
}

/**
 * Features a tag
 * POST /api/v1/featured_tags
 * OAuth Scope: write:accounts
 */
export async function feature(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IFeaturedTag> {
	const name = this.getNodeParameter('name', i) as string;
	return await handleApiRequest.call(this, 'POST', `${baseUrl}/api/v1/featured_tags`, { name });
}

/**
 * Unfeatures a tag
 * DELETE /api/v1/featured_tags/:id
 * OAuth Scope: write:accounts
 */
export async function unfeature(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<{}> {
	const tagId = this.getNodeParameter('tagId', i) as string;
	return await handleApiRequest.call(this, 'DELETE', `${baseUrl}/api/v1/featured_tags/${tagId}`);
}
