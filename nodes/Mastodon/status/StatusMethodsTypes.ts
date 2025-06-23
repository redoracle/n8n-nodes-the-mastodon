import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';

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
	): Promise<IDataObject[]>;

	view(
		this: IExecuteFunctions,
		baseUrl: string,
		items: INodeExecutionData[],
		i: number,
	): Promise<IDataObject[]>;

	delete(
		this: IExecuteFunctions,
		baseUrl: string,
		items: INodeExecutionData[],
		i: number,
	): Promise<IDataObject[]>;

	search(
		this: IExecuteFunctions,
		baseUrl: string,
		items: INodeExecutionData[],
		i: number,
	): Promise<IDataObject[]>;

	favourite(
		this: IExecuteFunctions,
		baseUrl: string,
		items: INodeExecutionData[],
		i: number,
	): Promise<IDataObject[]>;

	unfavourite(
		this: IExecuteFunctions,
		baseUrl: string,
		items: INodeExecutionData[],
		i: number,
	): Promise<IDataObject[]>;

	boost(
		this: IExecuteFunctions,
		baseUrl: string,
		items: INodeExecutionData[],
		i: number,
	): Promise<IDataObject[]>;

	unboost(
		this: IExecuteFunctions,
		baseUrl: string,
		items: INodeExecutionData[],
		i: number,
	): Promise<IDataObject[]>;

	bookmark(
		this: IExecuteFunctions,
		baseUrl: string,
		items: INodeExecutionData[],
		i: number,
	): Promise<IDataObject[]>;

	mediaUpload(
		this: IExecuteFunctions,
		baseUrl: string,
		items: INodeExecutionData[],
		i: number,
	): Promise<IDataObject[]>;

	scheduledStatuses(
		this: IExecuteFunctions,
		baseUrl: string,
		items: INodeExecutionData[],
		i: number,
	): Promise<IDataObject[]>;

	edit(
		this: IExecuteFunctions,
		baseUrl: string,
		items: INodeExecutionData[],
		i: number,
	): Promise<IDataObject[]>;

	viewEditHistory(
		this: IExecuteFunctions,
		baseUrl: string,
		items: INodeExecutionData[],
		i: number,
	): Promise<IDataObject[]>;

	viewSource(
		this: IExecuteFunctions,
		baseUrl: string,
		items: INodeExecutionData[],
		i: number,
	): Promise<IDataObject[]>;

	/**
	 * Get status context (ancestors and descendants)
	 * GET /api/v1/statuses/:id/context
	 */
	context(
		this: IExecuteFunctions,
		baseUrl: string,
		items: INodeExecutionData[],
		i: number,
	): Promise<IDataObject[]>;
}
