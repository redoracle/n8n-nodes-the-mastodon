import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { bindHandleApiRequest, handleApiRequest } from '../Mastodon_Methods';
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
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest('GET', `${baseUrl}/api/v1/announcements`);
}
