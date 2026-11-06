import { INodeProperties } from 'n8n-workflow';
import * as Methods from './NotificationMethods';
import * as Properties from './NotificationProperties';

export const notificationProperties: INodeProperties[] = [
	...Properties.notificationOperations,
	...Properties.notificationFields,
];

export const notificationMethods = {
	// Match the stable identifiers in the n8n Operation selector.
	get: Methods.getNotifications,
	dismiss: Methods.dismissNotification,
	unreadCount: Methods.getUnreadCount,
	// Keep old identifiers for already saved workflows and integrations.
	getNotifications: Methods.getNotifications,
	dismissNotification: Methods.dismissNotification,
	getUnreadCount: Methods.getUnreadCount,
};
