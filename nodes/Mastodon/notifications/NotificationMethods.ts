import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { bindHandleApiRequest } from '../Mastodon_Methods';
import { INotification, INotificationParams, IUnreadCount } from './NotificationInterfaces';

/**
 * Get Notifications
 * GET /api/v1/notifications
 * OAuth Scope: read:notifications
 */
export async function getNotifications(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<INotification[]> {
	const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
	const returnAll = this.getNodeParameter('returnAll', i) as boolean;
	const qs: INotificationParams = {};

	if (additionalFields.max_id) {
		qs.max_id = additionalFields.max_id as string;
	}
	if (additionalFields.since_id) {
		qs.since_id = additionalFields.since_id as string;
	}
	if (additionalFields.min_id) {
		qs.min_id = additionalFields.min_id as string;
	}
	if (additionalFields.types) {
		qs.types = additionalFields.types as string[];
	}
	if (additionalFields.exclude_types) {
		qs.exclude_types = additionalFields.exclude_types as string[];
	}
	if (!returnAll) {
		qs.limit = Math.min(this.getNodeParameter('limit', i) as number, 40);
	}

	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<INotification[]>('GET', `${baseUrl}/api/v1/notifications`, {}, qs);
}

/**
 * Dismiss a Notification
 * POST /api/v1/notifications/dismiss
 * OAuth Scope: write:notifications
 */
export async function dismissNotification(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<{}> {
	const notificationId = this.getNodeParameter('id', i) as string;

	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<{}>('POST', `${baseUrl}/api/v1/notifications/dismiss`, {
		id: notificationId,
	});
}

/**
 * Get Unread Notifications Count
 * GET /api/v1/notifications/unread_count
 * OAuth Scope: read:notifications
 */
export async function getUnreadCount(
	this: IExecuteFunctions,
	baseUrl: string,
): Promise<IUnreadCount> {
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<IUnreadCount>('GET', `${baseUrl}/api/v1/notifications/unread_count`);
}
