import { INodeProperties } from 'n8n-workflow';
import * as Methods from './AnnouncementMethods';
import * as Properties from './AnnouncementProperties';

export const announcementProperties: INodeProperties[] = [
	Properties.announcementOperations,
	...Properties.announcementFields,
];

export const announcementMethods = {
	list: Methods.list,
};
