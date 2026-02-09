import { IExecuteFunctions } from 'n8n-workflow';
import { Mastodon } from '../nodes/Mastodon/Mastodon.node';

describe('Mastodon Node - Search', () => {
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

	describe('search', () => {
		it('should search with basic query', async () => {
			const mockSearchResults = {
				accounts: [{ id: '1', username: 'testuser', acct: 'testuser@mastodon.social' }],
				statuses: [{ id: '100', content: 'Test status with query' }],
				hashtags: [{ name: 'test', url: 'https://mastodon.social/tags/test' }],
			};

			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'search';
				if (param === 'operation') return 'search';
				if (param === 'query') return 'test query';
				if (param === 'additionalFields') return {};
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockSearchResults);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					method: 'GET',
					uri: expect.stringContaining('/api/v2/search'),
					qs: expect.objectContaining({ q: 'test query' }),
				}),
			);
			expect(result[0][0].json).toEqual(mockSearchResults);
		});

		it('should search with type filter for accounts', async () => {
			const mockResults = {
				accounts: [
					{ id: '1', username: 'alice' },
					{ id: '2', username: 'bob' },
				],
				statuses: [],
				hashtags: [],
			};

			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'search';
				if (param === 'operation') return 'search';
				if (param === 'query') return 'alice';
				if (param === 'additionalFields') return { type: 'accounts' };
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResults);

			await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					qs: expect.objectContaining({
						q: 'alice',
						type: 'accounts',
					}),
				}),
			);
		});

		it('should search with type filter for statuses', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'search';
				if (param === 'operation') return 'search';
				if (param === 'query') return 'javascript';
				if (param === 'additionalFields') return { type: 'statuses' };
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue({
				accounts: [],
				statuses: [{ id: '1', content: 'Learning javascript' }],
				hashtags: [],
			});

			await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					qs: expect.objectContaining({
						type: 'statuses',
					}),
				}),
			);
		});

		it('should search with type filter for hashtags', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'search';
				if (param === 'operation') return 'search';
				if (param === 'query') return 'mastodon';
				if (param === 'additionalFields') return { type: 'hashtags' };
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue({
				accounts: [],
				statuses: [],
				hashtags: [{ name: 'mastodon', url: 'https://mastodon.social/tags/mastodon' }],
			});

			await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					qs: expect.objectContaining({
						type: 'hashtags',
					}),
				}),
			);
		});

		it('should search with resolve option', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'search';
				if (param === 'operation') return 'search';
				if (param === 'query') return '@user@instance.social';
				if (param === 'additionalFields') return { resolve: true };
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue({
				accounts: [{ id: '1', acct: 'user@instance.social' }],
				statuses: [],
				hashtags: [],
			});

			await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					qs: expect.objectContaining({
						resolve: true,
					}),
				}),
			);
		});

		it('should search with following filter', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'search';
				if (param === 'operation') return 'search';
				if (param === 'query') return 'friends';
				if (param === 'additionalFields') return { following: true };
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue({
				accounts: [],
				statuses: [],
				hashtags: [],
			});

			await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					qs: expect.objectContaining({
						following: true,
					}),
				}),
			);
		});

		it('should search with pagination parameters', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'search';
				if (param === 'operation') return 'search';
				if (param === 'query') return 'test';
				if (param === 'additionalFields') return { max_id: '100', min_id: '50', limit: 20 };
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue({
				accounts: [],
				statuses: [],
				hashtags: [],
			});

			await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					qs: expect.objectContaining({
						max_id: '100',
						min_id: '50',
						limit: 20,
					}),
				}),
			);
		});

		it('should search with account_id filter', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'search';
				if (param === 'operation') return 'search';
				if (param === 'query') return 'hello';
				if (param === 'additionalFields') return { account_id: 'account123' };
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue({
				accounts: [],
				statuses: [{ id: '1', account: { id: 'account123' } }],
				hashtags: [],
			});

			await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					qs: expect.objectContaining({
						account_id: 'account123',
					}),
				}),
			);
		});
	});
});
