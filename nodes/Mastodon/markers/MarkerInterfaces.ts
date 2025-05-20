import { IDataObject } from 'n8n-workflow';

// Modularized Marker interfaces for Mastodon node
export interface IMarker {
	last_read_id: string;
	version: number;
	updated_at: string;
}

export interface IMarkerResponse {
	home?: IMarker;
	notifications?: IMarker;
}

export interface IMarkerPayload {
	'home[last_read_id]'?: string;
	'notifications[last_read_id]'?: string;
}

export interface IMarkerParams {
	timeline: string[];
}
