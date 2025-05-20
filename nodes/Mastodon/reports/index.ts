import { INodeProperties } from 'n8n-workflow';
import * as Methods from './ReportMethods';
import { reportOperations, reportFields } from './ReportProperties';

export const reportProperties: INodeProperties[] = [...reportOperations, ...reportFields];

export const reportMethods = {
	create: Methods.create,
	listReports: Methods.listReports,
	resolveReport: Methods.resolveReport,
};
