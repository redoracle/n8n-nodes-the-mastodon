import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { bindHandleApiRequest } from '../Mastodon_Methods';

/**
 * Creates a new filter
 * POST /api/v1/filters
 */
export async function create(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IDataObject> {
	const phrase = this.getNodeParameter('phrase', i) as string;
	const context = this.getNodeParameter('context', i) as string[];
	const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

	const body: IDataObject = {
		phrase,
		context,
	};

	if (additionalFields.irreversible !== undefined) {
		body.irreversible = additionalFields.irreversible as boolean;
	}
	if (additionalFields.whole_word !== undefined) {
		body.whole_word = additionalFields.whole_word as boolean;
	}

	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest('POST', `${baseUrl}/api/v1/filters`, body);
}

/**
 * Updates an existing filter
 * PUT /api/v1/filters/:id
 */
export async function update(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IDataObject> {
	const filterId = this.getNodeParameter('filterId', i) as string;
	const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest('PUT', `${baseUrl}/api/v1/filters/${filterId}`, updateFields);
}

/**
 * Deletes a filter
 * DELETE /api/v1/filters/:id
 */
export async function remove(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IDataObject> {
	const filterId = this.getNodeParameter('filterId', i) as string;
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest('DELETE', `${baseUrl}/api/v1/filters/${filterId}`);
}
