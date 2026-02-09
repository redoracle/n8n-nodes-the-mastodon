import { IExecuteFunctions } from 'n8n-workflow';
import { Mastodon } from '../nodes/Mastodon/Mastodon.node';

describe('Mastodon Node - Notifications', () => {
	let node: Mastodon;
	let ctx: Partial<IExecuteFunctions>;

	beforeEach(() => {
		node = new Mastodon();
		ctx = {
			getNodeParameter: jest.fn(),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			helpers: { requestOAuth2: jest.fn() } as unknown as IExecuteFunctions['helpers'],
			getCredentials: jest.fn().mockResolvedValue({
				baseUrl: 'https://mastodon.social',
				oauth2: { accessToken: 'test-token' },
			}),
			continueOnFail: () => false,
			getNode: () =>
				({
					id: '1',
					type: 'mastodon',
					name: 'Mastodon',
					typeVersion: 1,
					position: [0, 0],
					parameters: {},
				}) as unknown as ReturnType<IExecuteFunctions['getNode']>,
		};
	});

	describe('getNotifications', () => {
		it('should get notifications with default parameters', async () => {
			const mockNotifications = [
				{
					id: '1',
					type: 'mention',
					created_at: '2026-02-09T10:00:00.000Z',
					account: { id: 'user123', username: 'testuser' },
					status: { id: 'status123', content: 'Hello!' },
				},
				{
					id: '2',
					type: 'favourite',
					created_at: '2026-02-09T09:00:00.000Z',
					account: { id: 'user456', username: 'otheruser' },
					status: { id: 'status456', content: 'Great post!' },
				},
			];

			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'notifications';
				if (param === 'operation') return 'getNotifications';
				if (param === 'returnAll') return false;
				if (param === 'limit') return 20;
				if (param === 'additionalFields') return {};
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockNotifications);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					method: 'GET',
					uri: expect.stringContaining('/api/v1/notifications'),
					qs: expect.objectContaining({ limit: 20 }),
				}),
			);
			expect(result[0]).toHaveLength(2);
			expect(result[0][0].json).toEqual(mockNotifications[0]);
		});

		it('should get notifications with type filter', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'notifications';
				if (param === 'operation') return 'getNotifications';
				if (param === 'returnAll') return false;
				if (param === 'limit') return 20;
				if (param === 'additionalFields') return { types: ['mention', 'reblog'] };
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue([]);

			await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					qs: expect.objectContaining({
						types: ['mention', 'reblog'],
						limit: 20,
					}),
				}),
			);
		});

		it('should get all notifications when returnAll is true', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'notifications';
				if (param === 'operation') return 'getNotifications';
				if (param === 'returnAll') return true;
				if (param === 'additionalFields') return {};
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue([]);

			await node.execute.call(ctx as IExecuteFunctions);

			const callArgs = (ctx.helpers!.requestOAuth2 as jest.Mock).mock.calls[0][1];
			expect(callArgs.qs?.limit).toBeUndefined();
		});

		it('should support pagination parameters', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'notifications';
				if (param === 'operation') return 'getNotifications';
				if (param === 'returnAll') return false;
				if (param === 'limit') return 10;
				if (param === 'additionalFields')
					return { max_id: 'notif999', since_id: 'notif100', min_id: 'notif50' };
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue([]);

			await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					qs: expect.objectContaining({
						max_id: 'notif999',
						since_id: 'notif100',
						min_id: 'notif50',
						limit: 10,
					}),
				}),
			);
		});
	});

	describe('dismissNotification', () => {
		it('should dismiss a notification', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'notifications';
				if (param === 'operation') return 'dismissNotification';
				if (param === 'id') return 'notif123';
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue({});

			await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					method: 'POST',
					uri: expect.stringContaining('/api/v1/notifications/dismiss'),
					body: expect.objectContaining({ id: 'notif123' }),
				}),
			);
		});
	});

	describe('getUnreadCount', () => {
		it('should get unread notification count', async () => {
			const mockUnreadCount = { count: 5 };

			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'notifications';
				if (param === 'operation') return 'getUnreadCount';
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockUnreadCount);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					method: 'GET',
					uri: expect.stringContaining('/api/v1/notifications/unread_count'),
				}),
			);
			expect(result[0][0].json).toEqual(mockUnreadCount);
		});
	});
});
