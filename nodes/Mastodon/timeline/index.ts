import { INodeProperties } from 'n8n-workflow';
import * as Methods from './TimelineMethods';
import * as Properties from './TimelineProperties';

export const timelineProperties: INodeProperties[] = [
	...Properties.timelineOperations,
	...Properties.timelineFields,
];

export const timelineMethods = {
	public: Methods.publicTimeline,
	hashtag: Methods.hashtagTimeline,
	home: Methods.homeTimeline,
	list: Methods.listTimeline,
	link: Methods.linkTimeline,
};
