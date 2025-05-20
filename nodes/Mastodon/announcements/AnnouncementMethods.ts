import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { handleApiRequest } from '../Mastodon_Methods';
import { IAnnouncement } from './AnnouncementInterfaces';

/**
 * View Announcements
 * GET /api/v1/announcements
 */
export async function list(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IAnnouncement[]> {
	return await handleApiRequest.call(this, 'GET', `${baseUrl}/api/v1/announcements`);
}
