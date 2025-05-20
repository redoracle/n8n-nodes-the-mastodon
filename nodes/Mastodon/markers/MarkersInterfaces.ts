import { IDataObject } from 'n8n-workflow';

export interface IMarker {
	last_read_id: string;
	version: number;
	updated_at: string;
}

export interface IMarkerRequest {
	home?: IDataObject;
	notifications?: IDataObject;
}

export interface IMarkersResponse {
	home?: IMarker;
	notifications?: IMarker;
}

export interface IMarkerPayload extends IDataObject {
	'home[last_read_id]'?: string;
	'notifications[last_read_id]'?: string;
}
