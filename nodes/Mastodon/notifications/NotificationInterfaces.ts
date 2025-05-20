import { IDataObject } from 'n8n-workflow';

export interface INotification {
	id: string;
	type: string;
	created_at: string;
	account: IDataObject;
	status?: IDataObject;
}

export interface INotificationParams extends IDataObject {
	max_id?: string;
	since_id?: string;
	min_id?: string;
	limit?: number;
	types?: string[];
	exclude_types?: string[];
}

export interface IUnreadCount {
	count: number;
}
