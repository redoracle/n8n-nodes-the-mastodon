import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';
import { Mastodon } from '../nodes/Mastodon/Mastodon.node';
import { notificationMethods } from '../nodes/Mastodon/notifications';
import { followRequestsMethods } from '../nodes/Mastodon/followRequests';
import { filterMethods } from '../nodes/Mastodon/filters';
import { accountMethods } from '../nodes/Mastodon/account';
import { statusMethods } from '../nodes/Mastodon/status';
import { ResponseCache } from '../nodes/Mastodon/Mastodon_Methods';

describe('Mastodon UI operation contract', () => {
	const node = new Mastodon();
	const properties = node.description.properties as INodeProperties[];
	const registries: Record<string, Record<string, unknown>> = {
		notifications: notificationMethods,
		followRequests: followRequestsMethods,
		filters: filterMethods,
		account: accountMethods,
		status: statusMethods,
	};

	for (const [resource, handlers] of Object.entries(registries)) {
		it(`has a callable handler for every displayed ${resource} operation`, () => {
			const menu = properties.find(
				(p) => p.name === 'operation' && p.displayOptions?.show?.resource?.includes(resource),
			);
			expect(menu).toBeDefined();
			const values = (menu?.options as Array<{ value: string }>).map((o) => o.value);
			expect(new Set(values).size).toBe(values.length);
			for (const operation of values) {
				expect(typeof handlers[operation]).toBe('function');
			}
		});
	}

	it('preserves prior saved-workflow operation identifiers', () => {
		expect(notificationMethods.getNotifications).toBe(notificationMethods.get);
		expect(notificationMethods.dismissNotification).toBe(notificationMethods.dismiss);
		expect(notificationMethods.getUnreadCount).toBe(notificationMethods.unreadCount);
		expect(followRequestsMethods.acceptRequest).toBe(followRequestsMethods.authorize);
		expect(followRequestsMethods.rejectRequest).toBe(followRequestsMethods.reject);
		expect(filterMethods.remove).toBe(filterMethods.delete);
	});

	const cases = [
		{
			resource: 'notifications',
			operation: 'get',
			verb: 'GET',
			path: '/api/v1/notifications',
			params: { additionalFields: {}, returnAll: false, limit: 20 },
		},
		{
			resource: 'notifications',
			operation: 'dismiss',
			verb: 'POST',
			path: '/api/v1/notifications/9/dismiss',
			params: { id: '9' },
		},
		{
			resource: 'notifications',
			operation: 'unreadCount',
			verb: 'GET',
			path: '/api/v1/notifications/unread_count',
			params: {},
		},
		{
			resource: 'filters',
			operation: 'delete',
			verb: 'DELETE',
			path: '/api/v1/filters/7',
			params: { filterId: '7' },
		},
		{
			resource: 'followRequests',
			operation: 'authorize',
			verb: 'POST',
			path: '/api/v1/follow_requests/8/authorize',
			params: { accountId: '8' },
		},
		{
			resource: 'followRequests',
			operation: 'reject',
			verb: 'POST',
			path: '/api/v1/follow_requests/8/reject',
			params: { accountId: '8' },
		},
		{
			resource: 'account',
			operation: 'follow',
			verb: 'POST',
			path: '/api/v1/accounts/3/follow',
			params: { accountId: '3' },
		},
		{
			resource: 'account',
			operation: 'getRelationships',
			verb: 'GET',
			path: '/api/v1/accounts/relationships',
			params: { ids: '3, 4' },
		},
		{
			resource: 'status',
			operation: 'boost',
			verb: 'POST',
			path: '/api/v1/statuses/5/reblog',
			params: { statusId: '5' },
		},
	];

	for (const { resource, operation, verb, path, params } of cases) {
		it(`dispatches the visible ${resource}/${operation} operation`, async () => {
			ResponseCache.getInstance().clear();
			const requestOAuth2 = jest.fn().mockResolvedValue({});
			const getNodeParameter = jest.fn(
				(key: string, _index: number, defaultValue?: unknown) => {
					if (key === 'resource') return resource;
					if (key === 'operation') return operation;
					if (key === 'authType') return 'oauth2';
					if (key === 'url') return '';
					return (params as Record<string, unknown>)[key] ?? defaultValue;
				},
			);
			const context = {
				getNodeParameter,
				getInputData: jest.fn().mockReturnValue([{ json: {} }]),
				getCredentials: jest.fn().mockResolvedValue({
					baseUrl: 'https://mastodon.social',
					oauth2: { accessToken: 'test-token' },
				}),
				helpers: { requestOAuth2 },
				continueOnFail: () => false,
				getNode: () => ({
					id: '1',
					name: 'Mastodon',
					type: 'mastodon',
					parameters: {},
				}),
			} as unknown as IExecuteFunctions;

			await node.execute.call(context);

			expect(requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({ method: verb, uri: `https://mastodon.social${path}` }),
			);
			if (resource === 'account' && operation === 'getRelationships') {
				expect(requestOAuth2.mock.calls[0][1].qs.id).toEqual(['3', '4']);
			}
			if (resource === 'notifications' && operation === 'dismiss') {
				expect(requestOAuth2.mock.calls[0][1].body).toBeUndefined();
			}
		});
	}
});
