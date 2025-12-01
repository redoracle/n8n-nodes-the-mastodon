import { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import * as Methods from './ReportMethods';
import { reportFields, reportOperations } from './ReportProperties';

export const reportProperties: INodeProperties[] = [...reportOperations, ...reportFields];

type ReportMethod = (
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
) => Promise<unknown>;

export const reportMethods: { [K in keyof typeof Methods]: ReportMethod } = {
	create: Methods.create,
	listReports: Methods.listReports,
	resolveReport: Methods.resolveReport,
};
