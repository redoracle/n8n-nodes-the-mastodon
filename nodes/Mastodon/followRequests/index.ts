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

export const followRequestsMethods: Record<string, FollowRequestMethod> = {
	list: FollowRequestMethods.list,
	// Match the identifiers actually exposed in the UI.
	authorize: FollowRequestMethods.acceptRequest,
	reject: FollowRequestMethods.rejectRequest,
	// Preserve legacy operation values in existing n8n workflows.
	acceptRequest: FollowRequestMethods.acceptRequest,
	rejectRequest: FollowRequestMethods.rejectRequest,
};
