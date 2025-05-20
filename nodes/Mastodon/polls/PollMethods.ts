import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { handleApiRequest } from '../Mastodon_Methods';

interface IPoll {
	id: string;
	expires_at: string | null;
	expired: boolean;
	multiple: boolean;
	votes_count: number;
	voters_count: number | null;
	options: {
		title: string;
		votes_count: number | null;
	}[];
	emojis: any[];
	voted?: boolean;
	own_votes?: number[];
}

/**
 * Views a poll
 * GET /api/v1/polls/:id
 */
export async function view(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IPoll> {
	const pollId = this.getNodeParameter('pollId', i) as string;
	return await handleApiRequest.call(this, 'GET', `${baseUrl}/api/v1/polls/${pollId}`);
}

/**
 * Votes on a poll
 * POST /api/v1/polls/:id/votes
 */
export async function vote(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IPoll> {
	const pollId = this.getNodeParameter('pollId', i) as string;
	const choices = this.getNodeParameter('choices', i) as number[];

	return await handleApiRequest.call(this, 'POST', `${baseUrl}/api/v1/polls/${pollId}/votes`, {
		choices,
	});
}
