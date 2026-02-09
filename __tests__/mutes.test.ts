import { IExecuteFunctions } from 'n8n-workflow';
import { Mastodon } from '../nodes/Mastodon/Mastodon.node';

describe('Mastodon Node - Mutes', () => {
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

	describe('mute', () => {
		it('should mute an account with default options', async () => {
			const mockMutedRelationship = {
				id: 'account123',
				muting: true,
				muting_notifications: false,
				following: true,
			};

			(ctx.getNodeParameter as jest.Mock).mockImplementation((param, index, defaultValue) => {
				if (param === 'resource') return 'mutes';
				if (param === 'operation') return 'mute';
				if (param === 'accountId') return 'account123';
				if (param === 'options') return defaultValue || {};
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockMutedRelationship);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					method: 'POST',
					uri: expect.stringContaining('/api/v1/accounts/account123/mute'),
				}),
			);
			expect(result[0][0].json.muting).toBe(true);
		});

		it('should mute an account with notifications muted', async () => {
			const mockRelationship = {
				id: 'account456',
				muting: true,
				muting_notifications: true,
			};

			(ctx.getNodeParameter as jest.Mock).mockImplementation((param, index, defaultValue) => {
				if (param === 'resource') return 'mutes';
				if (param === 'operation') return 'mute';
				if (param === 'accountId') return 'account456';
				if (param === 'options') return { notifications: true };
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockRelationship);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					body: expect.objectContaining({
						notifications: true,
					}),
				}),
			);
			expect(result[0][0].json.muting_notifications).toBe(true);
		});

		it('should mute an account with duration', async () => {
			const mockRelationship = {
				id: 'account789',
				muting: true,
				muted_until: '2026-02-16T10:00:00.000Z',
			};

			(ctx.getNodeParameter as jest.Mock).mockImplementation((param, index, defaultValue) => {
				if (param === 'resource') return 'mutes';
				if (param === 'operation') return 'mute';
				if (param === 'accountId') return 'account789';
				if (param === 'options') return { duration: 604800 }; // 7 days in seconds
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockRelationship);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					body: expect.objectContaining({
						duration: 604800,
					}),
				}),
			);
			expect(result[0][0].json.muting).toBe(true);
		});

		it('should mute an account with both notifications and duration', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param, index, defaultValue) => {
				if (param === 'resource') return 'mutes';
				if (param === 'operation') return 'mute';
				if (param === 'accountId') return 'account999';
				if (param === 'options') return { notifications: true, duration: 86400 }; // 1 day
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue({
				id: 'account999',
				muting: true,
				muting_notifications: true,
			});

			await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					body: expect.objectContaining({
						notifications: true,
						duration: 86400,
					}),
				}),
			);
		});
	});

	describe('unmute', () => {
		it('should unmute an account', async () => {
			const mockUnmutedRelationship = {
				id: 'account123',
				muting: false,
				muting_notifications: false,
			};

			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'mutes';
				if (param === 'operation') return 'unmute';
				if (param === 'accountId') return 'account123';
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockUnmutedRelationship);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					method: 'POST',
					uri: expect.stringContaining('/api/v1/accounts/account123/unmute'),
				}),
			);
			expect(result[0][0].json.muting).toBe(false);
		});

		it('should handle already unmuted account', async () => {
			const mockRelationship = {
				id: 'account456',
				muting: false,
			};

			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'mutes';
				if (param === 'operation') return 'unmute';
				if (param === 'accountId') return 'account456';
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockRelationship);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(result[0][0].json.muting).toBe(false);
		});
	});
});
