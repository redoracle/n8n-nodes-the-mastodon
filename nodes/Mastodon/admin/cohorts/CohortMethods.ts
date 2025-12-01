import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { bindHandleApiRequest, handleApiRequest } from '../../Mastodon_Methods';
import { ICohort } from '../AdminInterfaces';

export async function getRetentionData(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<ICohort> {
	const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
	const qs: IDataObject = {};

	if (additionalFields.frequency) {
		qs.frequency = additionalFields.frequency;
	}
	if (additionalFields.startDate) {
		qs.start_at = additionalFields.startDate;
	}

	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest<ICohort>('GET', `${baseUrl}/api/v1/admin/retention`, {}, qs);
}
