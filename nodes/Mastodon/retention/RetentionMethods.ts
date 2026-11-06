import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { bindHandleApiRequest } from '../Mastodon_Methods';
import { getAdminDateRange } from '../admin/AnalyticsContract';

/** POST the required time range and bucket size to the Mastodon admin retention API. */
export async function viewStatistics(
	this: IExecuteFunctions,
	baseUrl: string,
	_items: INodeExecutionData[] | undefined,
	i: number | undefined,
): Promise<IDataObject[]> {
	const index = i ?? 0;
	const range = getAdminDateRange.call(this, index);
	const frequency = this.getNodeParameter('frequency', index, 'day') as string;
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<IDataObject[]>('POST', `${baseUrl}/api/v1/admin/retention`, {
		...range,
		frequency,
	});
}
