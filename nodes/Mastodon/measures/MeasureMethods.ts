// Modularized Measure methods for Mastodon node
import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { bindHandleApiRequest } from '../Mastodon_Methods';

export async function listMeasures(this: IExecuteFunctions, baseUrl: string) {
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest('GET', `${baseUrl}/api/v1/admin/measures`);
}

export async function getMeasureMetrics(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
) {
	const measureId = this.getNodeParameter('measureId', i) as string;
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest('GET', `${baseUrl}/api/v1/admin/measures/${measureId}`);
}
