import { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { handleApiRequest } from '../Mastodon_Methods';
import { IWebPushSubscription, IPushSubscriptionData, IPushAlerts } from './PushInterfaces';

/**
 * Subscribe to push notifications
 * POST /api/v1/push/subscription
 * OAuth Scope: push
 */
export async function subscribe(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IWebPushSubscription> {
	const subscription = this.getNodeParameter('subscription', i) as IPushSubscriptionData;
	const alerts = this.getNodeParameter('alerts', i) as IPushAlerts;
	const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

	const body: IDataObject = {
		subscription,
		alerts,
	};

	if (additionalFields.policy) {
		body.policy = additionalFields.policy;
	}
	if (additionalFields.data) {
		body.data = additionalFields.data;
	}

	return await handleApiRequest.call(this, 'POST', `${baseUrl}/api/v1/push/subscription`, body);
}

/**
 * Get current subscription
 * GET /api/v1/push/subscription
 * OAuth Scope: push
 */
export async function get(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IWebPushSubscription> {
	return await handleApiRequest.call(this, 'GET', `${baseUrl}/api/v1/push/subscription`);
}

/**
 * Update subscription
 * PUT /api/v1/push/subscription
 * OAuth Scope: push
 */
export async function update(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IWebPushSubscription> {
	const alerts = this.getNodeParameter('alerts', i) as IPushAlerts;
	const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

	const body: IDataObject = {
		alerts,
	};

	if (additionalFields.policy) {
		body.policy = additionalFields.policy;
	}
	if (additionalFields.data) {
		body.data = additionalFields.data;
	}

	return await handleApiRequest.call(this, 'PUT', `${baseUrl}/api/v1/push/subscription`, body);
}

/**
 * Remove subscription
 * DELETE /api/v1/push/subscription
 * OAuth Scope: push
 */
export async function remove(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<{}> {
	return await handleApiRequest.call(this, 'DELETE', `${baseUrl}/api/v1/push/subscription`);
}
