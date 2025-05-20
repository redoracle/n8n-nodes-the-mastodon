import { IDataObject } from 'n8n-workflow';

export interface IStreamingParams {
	tag?: string;
	list?: string;
	local?: boolean;
}

export interface IStreamingResponse {
	event: string;
	payload: IDataObject;
}
