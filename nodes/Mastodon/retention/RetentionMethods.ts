// Modularized Retention methods for Mastodon node
import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { bindHandleApiRequest, handleApiRequest } from '../Mastodon_Methods';

export async function viewStatistics(
	this: IExecuteFunctions,
	baseUrl: string,
	_items: INodeExecutionData[] | undefined,
	i: number | undefined,
) {
	// items and i are accepted to match the common handler signature (baseUrl, items, i)
	// They are not used by this method but are kept for compatibility.
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest('GET', `${baseUrl}/api/v1/admin/retention`);
}
