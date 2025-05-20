// Modularized Measure methods for Mastodon node
import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { handleApiRequest } from '../Mastodon_Methods';

export async function listMeasures(this: IExecuteFunctions, baseUrl: string) {
	return await handleApiRequest.call(this, 'GET', `${baseUrl}/api/v1/admin/measures`);
}

export async function getMeasureMetrics(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
) {
	const measureId = this.getNodeParameter('measureId', i) as string;
	return await handleApiRequest.call(this, 'GET', `${baseUrl}/api/v1/admin/measures/${measureId}`);
}
