import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { handleApiRequest } from '../Mastodon_Methods';
import { ICustomEmoji } from './CustomEmojisInterfaces';

/**
 * List Custom Emojis
 * GET /api/v1/custom_emojis
 */
export async function list(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<ICustomEmoji[]> {
	return await handleApiRequest.call(this, 'GET', `${baseUrl}/api/v1/custom_emojis`);
}
