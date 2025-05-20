import { INodeProperties } from 'n8n-workflow';
import * as Methods from './NotificationMethods';
import * as Properties from './NotificationProperties';

export const notificationProperties: INodeProperties[] = [
	...Properties.notificationOperations,
	...Properties.notificationFields,
];

export const notificationMethods = {
	getNotifications: Methods.getNotifications,
	dismissNotification: Methods.dismissNotification,
	getUnreadCount: Methods.getUnreadCount,
};
