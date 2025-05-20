import { INodeProperties } from 'n8n-workflow';
import * as FollowRequestMethods from './FollowRequestMethods';
import { followRequestOperations, followRequestFields } from './FollowRequestProperties';

export const followRequestsProperties: INodeProperties[] = [
	...followRequestOperations,
	...followRequestFields,
];

export const followRequestsMethods = {
	list: FollowRequestMethods.list,
	acceptRequest: FollowRequestMethods.acceptRequest,
	rejectRequest: FollowRequestMethods.rejectRequest,
};
