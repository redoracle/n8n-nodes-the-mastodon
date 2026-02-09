import { IExecuteFunctions } from 'n8n-workflow';
import { Mastodon } from '../nodes/Mastodon/Mastodon.node';

describe('Mastodon Node - Blocks', () => {
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

	describe('block', () => {
		it('should block an account', async () => {
			const mockBlockedRelationship = {
				id: 'account123',
				blocking: true,
				following: false,
				followed_by: false,
				muting: false,
			};

			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'blocks';
				if (param === 'operation') return 'block';
				if (param === 'accountId') return 'account123';
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockBlockedRelationship);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					method: 'POST',
					uri: expect.stringContaining('/api/v1/accounts/account123/block'),
				}),
			);
			expect(result[0][0].json.blocking).toBe(true);
		});

		it('should handle already blocked account', async () => {
			const mockRelationship = {
				id: 'account456',
				blocking: true,
				following: false,
				followed_by: false,
				muting: false,
			};

			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'blocks';
				if (param === 'operation') return 'block';
				if (param === 'accountId') return 'account456';
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockRelationship);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(result[0][0].json.blocking).toBe(true);
		});

		it('should return correct relationship state after blocking a followed_by account', async () => {
			const mockRelationship = {
				id: 'account789',
				blocking: true,
				following: false,
				followed_by: true,
			};

			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'blocks';
				if (param === 'operation') return 'block';
				if (param === 'accountId') return 'account789';
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockRelationship);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(result[0][0].json.blocking).toBe(true);
			expect(result[0][0].json.following).toBe(false);
		});

		it('should throw when block request returns 404', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'blocks';
				if (param === 'operation') return 'block';
				if (param === 'accountId') return 'missing-account';
				return undefined;
			});
			const httpError = Object.assign(new Error('Status not found'), {
				statusCode: 404,
				code: 'NOT_FOUND',
			});
			(ctx.helpers!.requestOAuth2 as jest.Mock).mockRejectedValue(httpError);

			await expect(node.execute.call(ctx as IExecuteFunctions)).rejects.toThrow(
				'The requested block was not found. Please verify the ID or handle is correct.',
			);
		});

		it('should throw when block request returns 500', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'blocks';
				if (param === 'operation') return 'block';
				if (param === 'accountId') return 'account500';
				return undefined;
			});
			const httpError = Object.assign(new Error('Server Error'), {
				statusCode: 500,
				code: 'INTERNAL_SERVER_ERROR',
			});
			(ctx.helpers!.requestOAuth2 as jest.Mock).mockRejectedValue(httpError);

			await expect(node.execute.call(ctx as IExecuteFunctions)).rejects.toThrow('Server Error');
		});

		it('should throw when block request times out', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'blocks';
				if (param === 'operation') return 'block';
				if (param === 'accountId') return 'account-timeout';
				return undefined;
			});
			const timeoutError = Object.assign(new Error('Request timeout'), {
				statusCode: 408,
				code: 'REQUEST_TIMEOUT',
			});
			(ctx.helpers!.requestOAuth2 as jest.Mock).mockRejectedValue(timeoutError);

			await expect(node.execute.call(ctx as IExecuteFunctions)).rejects.toThrow(
				'Mastodon API error (408): Request timeout',
			);
		});

		it('should surface an error when accountId is missing', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'blocks';
				if (param === 'operation') return 'block';
				if (param === 'accountId') return '';
				return undefined;
			});
			const missingAccountError = Object.assign(new Error('Missing accountId'), {
				statusCode: 400,
				code: 'BAD_REQUEST',
			});
			(ctx.helpers!.requestOAuth2 as jest.Mock).mockRejectedValue(missingAccountError);

			await expect(node.execute.call(ctx as IExecuteFunctions)).rejects.toThrow(
				'Mastodon API error (400): Missing accountId',
			);
		});

		it('should return empty result when block fails and continueOnFail is true', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'blocks';
				if (param === 'operation') return 'block';
				if (param === 'accountId') return 'account401';
				return undefined;
			});
			const httpError = Object.assign(new Error('Unauthorized'), {
				statusCode: 401,
				code: 'UNAUTHORIZED',
			});
			(ctx.helpers!.requestOAuth2 as jest.Mock).mockRejectedValue(httpError);
			ctx.continueOnFail = jest.fn().mockReturnValue(true);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(result[0]).toHaveLength(0);
			expect(ctx.continueOnFail).toHaveBeenCalled();
		});
	});

	describe('unblock', () => {
		it('should unblock an account', async () => {
			const mockUnblockedRelationship = {
				id: 'account123',
				blocking: false,
				following: false,
				followed_by: false,
			};

			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'blocks';
				if (param === 'operation') return 'unblock';
				if (param === 'accountId') return 'account123';
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockUnblockedRelationship);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					method: 'POST',
					uri: expect.stringContaining('/api/v1/accounts/account123/unblock'),
				}),
			);
			expect(result[0][0].json.blocking).toBe(false);
		});

		it('should handle already unblocked account', async () => {
			const mockRelationship = {
				id: 'account456',
				blocking: false,
				following: false,
				followed_by: false,
				muting: false,
				muting_notifications: false,
				requested: false,
				domain_blocking: false,
				showing_reblogs: true,
				notifying: false,
				endorsed: false,
				note: '',
				type: 'relationship',
				status: 'active',
				sourceId: 'account456',
				targetId: 'account456',
				createdAt: '2026-02-09T10:00:00.000Z',
				updatedAt: '2026-02-09T10:00:00.000Z',
				metadata: {},
			};

			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'blocks';
				if (param === 'operation') return 'unblock';
				if (param === 'accountId') return 'account456';
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockRelationship);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(result[0][0].json.blocking).toBe(false);
		});

		it('should unblock without restoring following relationship', async () => {
			const mockRelationship = {
				id: 'account789',
				blocking: false,
				following: false,
				followed_by: true,
			};

			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'blocks';
				if (param === 'operation') return 'unblock';
				if (param === 'accountId') return 'account789';
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockRelationship);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(result[0][0].json.blocking).toBe(false);
			expect(result[0][0].json.following).toBe(false);
		});
	});
});
