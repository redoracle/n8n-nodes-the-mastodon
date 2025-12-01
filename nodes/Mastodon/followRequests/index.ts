import { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import * as FollowRequestMethods from './FollowRequestMethods';
import { followRequestFields, followRequestOperations } from './FollowRequestProperties';

export const followRequestsProperties: INodeProperties[] = [
	...followRequestOperations,
	...followRequestFields,
];

type FollowRequestMethod = (
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
) => Promise<unknown>;

export const followRequestsMethods: {
	[K in keyof typeof FollowRequestMethods]: FollowRequestMethod;
} = {
	list: FollowRequestMethods.list,
	acceptRequest: FollowRequestMethods.acceptRequest,
	rejectRequest: FollowRequestMethods.rejectRequest,
};
