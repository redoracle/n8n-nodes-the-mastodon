import { INodeProperties } from 'n8n-workflow';
import * as TagMethods from './TagMethods';
import { tagOperations, tagFields } from './TagProperties';

export const tagProperties: INodeProperties[] = [...tagOperations, ...tagFields];

export const tagMethods = {
	get: TagMethods.get,
	follow: TagMethods.follow,
	unfollow: TagMethods.unfollow,
};
