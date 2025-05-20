import { INodeProperties } from 'n8n-workflow';
import * as ScheduledStatusMethods from './ScheduledStatusMethods';
import { scheduledStatusOperations, scheduledStatusFields } from './ScheduledStatusProperties';

export const scheduledStatusProperties: INodeProperties[] = [
	...scheduledStatusOperations,
	...scheduledStatusFields,
];

export const scheduledStatusMethods = {
	list: ScheduledStatusMethods.list,
	view: ScheduledStatusMethods.view,
	update: ScheduledStatusMethods.update,
	cancel: ScheduledStatusMethods.cancel,
};
