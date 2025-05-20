// Modularized Timeline interfaces for Mastodon node
import { IStatus } from '../status/StatusInterface';

export interface ITimelineParams {
	local?: boolean;
	remote?: boolean;
	only_media?: boolean;
	max_id?: string;
	since_id?: string;
	min_id?: string;
	limit?: number;
	any?: string[];
	all?: string[];
	none?: string[];
}

export type ITimeline = IStatus[];
