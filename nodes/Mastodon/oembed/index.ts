import { INodeProperties } from 'n8n-workflow';
import * as Methods from './OEmbedMethods';
import { oembedOperations, oembedFields } from './OEmbedProperties';

export const oembedProperties: INodeProperties[] = [...oembedOperations, ...oembedFields];

export const oembedMethods = {
	fetchOembed: Methods.fetchOembed,
};
