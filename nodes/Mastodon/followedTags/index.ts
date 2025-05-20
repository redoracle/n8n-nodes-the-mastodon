import { INodeProperties } from 'n8n-workflow';
import * as FollowedTagsMethods from './FollowedTagsMethods';
import { followedTagsOperations, followedTagsFields } from './FollowedTagsProperties';

export const followedTagsProperties: INodeProperties[] = [
	...followedTagsOperations,
	...followedTagsFields,
];

export const followedTagsMethods = {
	list: FollowedTagsMethods.list,
};
