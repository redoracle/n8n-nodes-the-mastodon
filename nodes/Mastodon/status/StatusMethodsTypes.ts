import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

export interface IStatus {
	id: string;
	content: string;
	created_at: string;
	visibility: 'public' | 'unlisted' | 'private' | 'direct';
	sensitive: boolean;
	spoiler_text?: string;
	media_attachments?: any[];
	url: string;
}

export interface IMediaAttachment {
	id: string;
	type: string;
	url: string;
	preview_url: string;
	description?: string;
}

export interface IStatusSource {
	id: string;
	text: string;
	spoiler_text: string;
}

export interface IStatusMethods {
	create(
		this: IExecuteFunctions,
		baseUrl: string,
		items: INodeExecutionData[],
		i: number,
	): Promise<IStatus[]>;

	view(
		this: IExecuteFunctions,
		baseUrl: string,
		items: INodeExecutionData[],
		i: number,
	): Promise<IStatus[]>;

	delete(
		this: IExecuteFunctions,
		baseUrl: string,
		items: INodeExecutionData[],
		i: number,
	): Promise<{}[]>;

	search(
		this: IExecuteFunctions,
		baseUrl: string,
		items: INodeExecutionData[],
		i: number,
	): Promise<IStatus[]>;

	favourite(
		this: IExecuteFunctions,
		baseUrl: string,
		items: INodeExecutionData[],
		i: number,
	): Promise<IStatus[]>;

	unfavourite(
		this: IExecuteFunctions,
		baseUrl: string,
		items: INodeExecutionData[],
		i: number,
	): Promise<IStatus[]>;

	boost(
		this: IExecuteFunctions,
		baseUrl: string,
		items: INodeExecutionData[],
		i: number,
	): Promise<IStatus[]>;

	unboost(
		this: IExecuteFunctions,
		baseUrl: string,
		items: INodeExecutionData[],
		i: number,
	): Promise<IStatus[]>;

	bookmark(
		this: IExecuteFunctions,
		baseUrl: string,
		items: INodeExecutionData[],
		i: number,
	): Promise<IStatus[]>;

	mediaUpload(
		this: IExecuteFunctions,
		baseUrl: string,
		items: INodeExecutionData[],
		i: number,
	): Promise<IMediaAttachment[]>;

	scheduledStatuses(
		this: IExecuteFunctions,
		baseUrl: string,
		items: INodeExecutionData[],
		i: number,
	): Promise<IStatus[]>;

	edit(
		this: IExecuteFunctions,
		baseUrl: string,
		items: INodeExecutionData[],
		i: number,
	): Promise<IStatus[]>;

	viewEditHistory(
		this: IExecuteFunctions,
		baseUrl: string,
		items: INodeExecutionData[],
		i: number,
	): Promise<IStatus[]>;

	viewSource(
		this: IExecuteFunctions,
		baseUrl: string,
		items: INodeExecutionData[],
		i: number,
	): Promise<IStatusSource[]>;
}
