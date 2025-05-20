import { INodeProperties } from 'n8n-workflow';
import * as Methods from './StreamingMethods';
import * as Properties from './StreamingProperties';

export const streamingProperties: INodeProperties[] = [
	...Properties.streamingOperations,
	...Properties.streamingFields,
];

export const streamingMethods = {
	public: Methods.streamPublic,
	hashtag: Methods.streamHashtag,
	user: Methods.streamUser,
};
