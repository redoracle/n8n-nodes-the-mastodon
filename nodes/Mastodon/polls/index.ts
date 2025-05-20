import { INodeProperties } from 'n8n-workflow';
import * as PollMethods from './PollMethods';
import { pollOperations, pollFields } from './PollProperties';

export const pollProperties: INodeProperties[] = [...pollOperations, ...pollFields];

export const pollMethods = {
	view: PollMethods.view,
	vote: PollMethods.vote,
};
