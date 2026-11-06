import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { bindHandleApiRequest } from '../../Mastodon_Methods';
import { getAdminDateRange } from '../AnalyticsContract';
import { ICohort } from '../AdminInterfaces';

export async function getRetentionData(
	this: IExecuteFunctions,
	baseUrl: string,
	_items: INodeExecutionData[],
	i: number,
): Promise<ICohort[]> {
	// Retain previous collection parameter names for saved-workflow compatibility.
	const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
	const range = getAdminDateRange.call(this, i, {
		startDate: additionalFields.startDate as string | undefined,
		endDate: additionalFields.endDate as string | undefined,
	});
	const frequency = (additionalFields.frequency as string) || 'day';
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<ICohort[]>('POST', `${baseUrl}/api/v1/admin/retention`, {
		...range,
		frequency,
	});
}
