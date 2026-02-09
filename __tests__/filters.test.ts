import { IExecuteFunctions } from 'n8n-workflow';
import { Mastodon } from '../nodes/Mastodon/Mastodon.node';

describe('Mastodon Node - Filters', () => {
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

	describe('create', () => {
		it('should create a filter with required parameters', async () => {
			const mockFilter = {
				id: 'filter123',
				phrase: 'spam',
				context: ['home', 'notifications'],
				whole_word: true,
				expires_at: null,
				irreversible: false,
			};

			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'filters';
				if (param === 'operation') return 'create';
				if (param === 'phrase') return 'spam';
				if (param === 'context') return ['home', 'notifications'];
				if (param === 'additionalFields') return {};
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockFilter);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					method: 'POST',
					uri: expect.stringContaining('/api/v1/filters'),
					body: expect.objectContaining({
						phrase: 'spam',
						context: ['home', 'notifications'],
					}),
				}),
			);
			expect(result[0][0].json).toEqual(mockFilter);
		});

		it('should create a filter with whole_word option', async () => {
			const mockFilter = {
				id: 'filter456',
				phrase: 'test',
				whole_word: true,
			};

			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'filters';
				if (param === 'operation') return 'create';
				if (param === 'phrase') return 'test';
				if (param === 'context') return ['public'];
				if (param === 'additionalFields') return { whole_word: true };
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockFilter);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					body: expect.objectContaining({
						whole_word: true,
					}),
				}),
			);
			expect(result[0][0].json).toEqual(mockFilter);
		});

		it('should create an irreversible filter', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'filters';
				if (param === 'operation') return 'create';
				if (param === 'phrase') return 'offensive';
				if (param === 'context') return ['home', 'notifications', 'public', 'thread'];
				if (param === 'additionalFields') return { irreversible: true };
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue({
				id: 'filter789',
				phrase: 'offensive',
				irreversible: true,
			});

			await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					body: expect.objectContaining({
						irreversible: true,
					}),
				}),
			);
		});

		it('should create a filter with expires_at', async () => {
			const expiresAt = '2026-12-31T23:59:59Z';
			const mockFilter = {
				id: 'filter999',
				phrase: 'temporary',
				context: ['home'],
				expires_at: expiresAt,
			};

			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'filters';
				if (param === 'operation') return 'create';
				if (param === 'phrase') return 'temporary';
				if (param === 'context') return ['home'];
				if (param === 'additionalFields') return { expires_at: expiresAt };
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockFilter);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					method: 'POST',
					uri: expect.stringContaining('/api/v1/filters'),
					body: expect.objectContaining({
						phrase: 'temporary',
						context: ['home'],
						expires_at: expiresAt,
					}),
				}),
			);
			expect(result[0][0].json).toEqual(mockFilter);
		});

		it('should throw error when API request fails and continueOnFail is false', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'filters';
				if (param === 'operation') return 'create';
				if (param === 'phrase') return 'test';
				if (param === 'context') return ['home'];
				if (param === 'additionalFields') return {};
				if (param === 'authType') return 'oAuth2';
				if (param === 'url') return 'https://mastodon.social';
				return undefined;
			});
			const httpError = Object.assign(new Error('Unauthorized'), {
				statusCode: 401,
				code: 'UNAUTHORIZED',
			});
			(ctx.helpers!.requestOAuth2 as jest.Mock).mockRejectedValue(httpError);
			ctx.continueOnFail = jest.fn().mockReturnValue(false);

			await expect(node.execute.call(ctx as IExecuteFunctions)).rejects.toThrow();
		});

		it('should return empty result when API request fails and continueOnFail is true', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'filters';
				if (param === 'operation') return 'create';
				if (param === 'phrase') return 'test';
				if (param === 'context') return ['home'];
				if (param === 'additionalFields') return {};
				if (param === 'authType') return 'oAuth2';
				if (param === 'url') return 'https://mastodon.social';
				return undefined;
			});
			const httpError = Object.assign(new Error('Server Error'), {
				statusCode: 500,
				code: 'INTERNAL_SERVER_ERROR',
			});
			(ctx.helpers!.requestOAuth2 as jest.Mock).mockRejectedValue(httpError);
			ctx.continueOnFail = jest.fn().mockReturnValue(true);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(result[0]).toHaveLength(0);
			expect(ctx.continueOnFail).toHaveBeenCalled();
		});
	});

	describe('update', () => {
		it('should update a filter', async () => {
			const mockUpdatedFilter = {
				id: 'filter123',
				phrase: 'updated phrase',
				context: ['home'],
				whole_word: false,
			};

			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'filters';
				if (param === 'operation') return 'update';
				if (param === 'filterId') return 'filter123';
				if (param === 'updateFields') return { phrase: 'updated phrase' };
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockUpdatedFilter);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					method: 'PUT',
					uri: expect.stringContaining('/api/v1/filters/filter123'),
					body: expect.objectContaining({
						phrase: 'updated phrase',
					}),
				}),
			);
			expect(result[0][0].json).toEqual(mockUpdatedFilter);
		});

		it('should update filter context', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'filters';
				if (param === 'operation') return 'update';
				if (param === 'filterId') return 'filter123';
				if (param === 'updateFields') return { context: ['public', 'thread'] };
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue({
				id: 'filter123',
				context: ['public', 'thread'],
			});

			await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					body: expect.objectContaining({
						context: ['public', 'thread'],
					}),
				}),
			);
		});

		it('should throw error on 404 when filter not found and continueOnFail is false', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'filters';
				if (param === 'operation') return 'update';
				if (param === 'filterId') return 'nonexistent';
				if (param === 'updateFields') return { phrase: 'updated' };
				if (param === 'authType') return 'oAuth2';
				if (param === 'url') return 'https://mastodon.social';
				return undefined;
			});
			const httpError = Object.assign(new Error('Not Found'), {
				statusCode: 404,
				code: 'NOT_FOUND',
			});
			(ctx.helpers!.requestOAuth2 as jest.Mock).mockRejectedValue(httpError);
			ctx.continueOnFail = jest.fn().mockReturnValue(false);

			await expect(node.execute.call(ctx as IExecuteFunctions)).rejects.toThrow();
		});
	});

	describe('remove', () => {
		it('should remove a filter', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'filters';
				if (param === 'operation') return 'remove';
				if (param === 'filterId') return 'filter123';
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue({});

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					method: 'DELETE',
					uri: expect.stringContaining('/api/v1/filters/filter123'),
				}),
			);
			expect(result[0][0].json).toEqual({});
		});

		it('should handle permission error when continueOnFail is true', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'filters';
				if (param === 'operation') return 'remove';
				if (param === 'filterId') return 'filter999';
				if (param === 'authType') return 'oAuth2';
				if (param === 'url') return 'https://mastodon.social';
				return undefined;
			});
			const httpError = Object.assign(new Error('Forbidden'), {
				statusCode: 403,
				code: 'FORBIDDEN',
			});
			(ctx.helpers!.requestOAuth2 as jest.Mock).mockRejectedValue(httpError);
			ctx.continueOnFail = jest.fn().mockReturnValue(true);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(result[0]).toHaveLength(0);
			expect(ctx.continueOnFail).toHaveBeenCalled();
		});
	});
});
