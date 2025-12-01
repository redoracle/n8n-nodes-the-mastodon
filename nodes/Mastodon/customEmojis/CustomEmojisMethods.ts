import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { bindHandleApiRequest, handleApiRequest } from '../Mastodon_Methods';
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
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<ICustomEmoji[]>('GET', `${baseUrl}/api/v1/custom_emojis`);
}
