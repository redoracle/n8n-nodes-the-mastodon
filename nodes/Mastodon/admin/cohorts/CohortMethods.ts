import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { handleApiRequest } from '../../Mastodon_Methods';
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

	return await handleApiRequest.call(this, 'GET', `${baseUrl}/api/v1/admin/retention`, {}, qs);
}
