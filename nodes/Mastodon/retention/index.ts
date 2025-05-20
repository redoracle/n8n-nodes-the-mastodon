import { INodeProperties } from 'n8n-workflow';
import * as Methods from './RetentionMethods';
import { retentionOperations, retentionFields } from './RetentionProperties';

export const retentionProperties: INodeProperties[] = [...retentionOperations, ...retentionFields];

export const retentionMethods = {
	viewStatistics: Methods.viewStatistics,
};
