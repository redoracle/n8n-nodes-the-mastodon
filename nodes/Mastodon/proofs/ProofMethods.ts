// Modularized Proof methods for Mastodon node
import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { bindHandleApiRequest } from '../Mastodon_Methods';

export async function listProofs(
	this: IExecuteFunctions,
	baseUrl: string,
	_items?: INodeExecutionData[],
	i?: number,
) {
	// items and i are accepted for compatibility with handler signature (url, items, i)
	const apiRequest = bindHandleApiRequest(this);
	return await apiRequest('GET', `${baseUrl}/api/v1/proofs`);
}
