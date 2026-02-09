import { IExecuteFunctions } from 'n8n-workflow';
import { Mastodon } from '../nodes/Mastodon/Mastodon.node';
import { ResponseCache } from '../nodes/Mastodon/Mastodon_Methods';

describe('Mastodon Node - Favourites', () => {
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
			ResponseCache.getInstance().clear();
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('getFavourites', () => {
		it('should get favourites with default limit', async () => {
			const mockFavourites = [
				{
					id: 'status1',
					content: 'Favourite post 1',
					favourited: true,
					created_at: '2026-02-09T10:00:00.000Z',
				},
				{
					id: 'status2',
					content: 'Favourite post 2',
					favourited: true,
					created_at: '2026-02-09T09:00:00.000Z',
				},
			];

			(ctx.getNodeParameter as jest.Mock).mockImplementation((param, index, defaultValue) => {
				if (param === 'resource') return 'favourites';
				if (param === 'operation') return 'getFavourites';
				if (param === 'authType') return 'oAuth2';
				if (param === 'url') return 'https://mastodon.social';
				if (param === 'limit') return defaultValue || 20;
				return undefined;
			});
			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockFavourites);

			const result = await node.execute.call(ctx as IExecuteFunctions);
			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					method: 'GET',
					uri: expect.stringContaining('/api/v1/favourites'),
				}),
			);
			expect(result[0]).toHaveLength(2);
			expect(result[0][0].json).toEqual(mockFavourites[0]);
		});

		it('should get favourites with a custom limit', async () => {
			const mockFavourites = Array.from({ length: 5 }, (_value, index) => ({
				id: `status${index + 1}`,
				content: `Favourite post ${index + 1}`,
				favourited: true,
				created_at: '2026-02-09T10:00:00.000Z',
			}));

			(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
				if (param === 'resource') return 'favourites';
				if (param === 'operation') return 'getFavourites';
				if (param === 'authType') return 'oAuth2';
				if (param === 'url') return 'https://mastodon.social';
				if (param === 'limit') return 5;
				return defaultValue;
			});
			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockFavourites);

			const result = await node.execute.call(ctx as IExecuteFunctions);
			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					method: 'GET',
					uri: expect.stringContaining('/api/v1/favourites'),
					body: expect.objectContaining({
						limit: 5,
					}),
				}),
			);
			expect(result[0]).toHaveLength(5);
		});

		it('should return an empty array when no favourites are found', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
				if (param === 'resource') return 'favourites';
				if (param === 'operation') return 'getFavourites';
				if (param === 'authType') return 'oAuth2';
				if (param === 'url') return 'https://mastodon.social';
				if (param === 'limit') return defaultValue || 20;
				return undefined;
			});
			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue([]);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(result[0]).toHaveLength(0);
		});

		it('should not paginate favourites when link header is present', async () => {
			const mockFavourites = [{ id: 'status1' }, { id: 'status2' }];
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
				if (param === 'resource') return 'favourites';
				if (param === 'operation') return 'getFavourites';
				if (param === 'authType') return 'oAuth2';
				if (param === 'url') return 'https://mastodon.social';
				if (param === 'limit') return 2;
				return defaultValue;
			});
			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue({
				body: mockFavourites,
				headers: {
					link: '<https://mastodon.social/api/v1/favourites?max_id=1>; rel="next"',
				},
			});

			const result = await node.execute.call(ctx as IExecuteFunctions);
			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledTimes(1);
			const requestOptions = (ctx.helpers!.requestOAuth2 as jest.Mock).mock.calls[0][1];
			expect(requestOptions.body).toEqual({ limit: 2 });
			expect(result[0]).toHaveLength(2);
		});
	});

	describe('favourite', () => {
		it('should favourite a status', async () => {
			const mockFavouritedStatus = {
				id: 'status123',
				content: 'Great post!',
				favourited: true,
				favourites_count: 5,
			};

			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'favourites';
				if (param === 'operation') return 'favourite';
				if (param === 'authType') return 'oAuth2';
				if (param === 'url') return 'https://mastodon.social';
				if (param === 'statusId') return 'status123';
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockFavouritedStatus);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					method: 'POST',
					uri: expect.stringContaining('/api/v1/statuses/status123/favourite'),
				}),
			);
			expect(result[0][0].json.favourited).toBe(true);
		});

		it('should handle already favourited status', async () => {
			const mockStatus = {
				id: 'status456',
				content: 'Already liked this',
				favourited: true,
			};

			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'favourites';
				if (param === 'operation') return 'favourite';
				if (param === 'authType') return 'oAuth2';
				if (param === 'url') return 'https://mastodon.social';
				if (param === 'statusId') return 'status456';
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockStatus);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(result[0][0].json.favourited).toBe(true);
		});

		it('should throw when favouriting fails', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'favourites';
				if (param === 'operation') return 'favourite';
				if (param === 'authType') return 'oAuth2';
				if (param === 'url') return 'https://mastodon.social';
				if (param === 'statusId') return 'missing-status';
				return undefined;
			});
			const httpError = Object.assign(new Error('Status not found'), {
				statusCode: 404,
				code: 'NOT_FOUND',
			});
			(ctx.helpers!.requestOAuth2 as jest.Mock).mockRejectedValue(httpError);

			await expect(node.execute.call(ctx as IExecuteFunctions)).rejects.toThrow(
				'The requested favourite was not found. Please verify the ID or handle is correct.',
			);
		});
	});

	describe('unfavourite', () => {
		it('should unfavourite a status', async () => {
			const mockUnfavouritedStatus = {
				id: 'status789',
				content: 'Post content',
				favourited: false,
				favourites_count: 4,
			};

			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'favourites';
				if (param === 'operation') return 'unfavourite';
				if (param === 'authType') return 'oAuth2';
				if (param === 'url') return 'https://mastodon.social';
				if (param === 'statusId') return 'status789';
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockUnfavouritedStatus);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					method: 'POST',
					uri: expect.stringContaining('/api/v1/statuses/status789/unfavourite'),
				}),
			);
			expect(result[0][0].json.favourited).toBe(false);
		});

		it('should handle not favourited status', async () => {
			const mockStatus = {
				id: 'status999',
				content: 'Never liked this',
				favourited: false,
			};

			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'favourites';
				if (param === 'operation') return 'unfavourite';
				if (param === 'authType') return 'oAuth2';
				if (param === 'url') return 'https://mastodon.social';
				if (param === 'statusId') return 'status999';
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockStatus);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(result[0][0].json.favourited).toBe(false);
		});

		it('should throw when unfavouriting fails', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'favourites';
				if (param === 'operation') return 'unfavourite';
				if (param === 'authType') return 'oAuth2';
				if (param === 'url') return 'https://mastodon.social';
				if (param === 'statusId') return 'status401';
				return undefined;
			});
			const httpError = Object.assign(new Error('Unauthorized'), {
				statusCode: 401,
				code: 'UNAUTHORIZED',
			});
			(ctx.helpers!.requestOAuth2 as jest.Mock).mockRejectedValue(httpError);

			await expect(node.execute.call(ctx as IExecuteFunctions)).rejects.toThrow(
				'Authentication failed: Please reconnect your Mastodon credentials.',
			);
		});
	});
});
