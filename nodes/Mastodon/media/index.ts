import { INodeProperties } from 'n8n-workflow';
import * as MediaMethods from './MediaMethods';
import { mediaOperations, mediaFields } from './MediaProperties';

export const mediaProperties: INodeProperties[] = [...mediaOperations, ...mediaFields];

export const mediaMethods = {
	upload: MediaMethods.upload,
	update: MediaMethods.update,
};
