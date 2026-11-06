import { IDataObject, IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import { bindHandleApiRequest } from '../Mastodon_Methods';
import { getAdminDateRange } from '../admin/AnalyticsContract';

// These keys do not require additional tag/domain context.
const DEFAULT_MEASURES = [
	'active_users',
	'new_users',
	'interactions',
	'opened_reports',
	'resolved_reports',
];

export async function listMeasures(
	this: IExecuteFunctions,
	baseUrl: string,
	_items: INodeExecutionData[],
	i: number,
): Promise<IDataObject[]> {
	const range = getAdminDateRange.call(this, i);
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<IDataObject[]>('POST', `${baseUrl}/api/v1/admin/measures`, {
		keys: DEFAULT_MEASURES,
		...range,
	});
}

export async function getMeasureMetrics(
	this: IExecuteFunctions,
	baseUrl: string,
	_items: INodeExecutionData[],
	i: number,
): Promise<IDataObject> {
	const key = this.getNodeParameter('measureId', i) as string;
	if (!key?.trim()) {
		throw new NodeOperationError(this.getNode(), 'Measure Key is required');
	}
	const range = getAdminDateRange.call(this, i);
	const apiRequest = bindHandleApiRequest(this);
	const response = await apiRequest<IDataObject[]>('POST', `${baseUrl}/api/v1/admin/measures`, {
		keys: [key],
		...range,
	});
	return Array.isArray(response) ? response[0] || {} : response;
}
