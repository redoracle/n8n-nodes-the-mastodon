import { IExecuteFunctions } from 'n8n-workflow';
import { Mastodon } from '../nodes/Mastodon/Mastodon.node';

describe('Mastodon Node - Conversations', () => {
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

	describe('get', () => {
		it('should list conversations', async () => {
			const mockResponse = [{ id: 'c1' }, { id: 'c2' }];
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
				if (param === 'resource') return 'conversations';
				if (param === 'operation') return 'get';
				if (param === 'additionalFields') return defaultValue || {};
				return undefined;
			});
			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					method: 'GET',
					uri: expect.stringContaining('/api/v1/conversations'),
				}),
			);
			// Verify both conversations are returned
			expect(result[0]).toHaveLength(2);
			expect(result[0][0].json).toEqual(mockResponse[0]);
			expect(result[0][1].json).toEqual(mockResponse[1]);
		});
	});

	describe('removeConversation', () => {
		it('should remove a conversation', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'conversations';
				if (param === 'operation') return 'removeConversation';
				if (param === 'conversationId') return 'conv1';
				return undefined;
			});
			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue({});

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					method: 'DELETE',
					uri: expect.stringContaining('/api/v1/conversations/conv1'),
				}),
			);
			expect(result[0][0].json).toEqual({});
		});
	});

	describe('markAsRead', () => {
		it('should mark conversation as read', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'conversations';
				if (param === 'operation') return 'markAsRead';
				if (param === 'conversationId') return 'conv2';
				return undefined;
			});
			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue({});

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					method: 'POST',
					uri: expect.stringContaining('/api/v1/conversations/conv2/read'),
				}),
			);
			expect(result[0][0].json).toEqual({});
		});
	});

	describe('error handling', () => {
		it('should throw error when API request fails and continueOnFail is false', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'conversations';
				if (param === 'operation') return 'removeConversation';
				if (param === 'conversationId') return 'conv1';
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

		it('should return error item when API request fails and continueOnFail is true', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'conversations';
				if (param === 'operation') return 'markAsRead';
				if (param === 'conversationId') return 'conv2';
				if (param === 'authType') return 'oAuth2';
				if (param === 'url') return 'https://mastodon.social';
				return undefined;
			});
			const httpError = Object.assign(new Error('Unauthorized'), {
				statusCode: 401,
				code: 'UNAUTHORIZED',
			});
			(ctx.helpers!.requestOAuth2 as jest.Mock).mockRejectedValue(httpError);
			ctx.continueOnFail = jest.fn().mockReturnValue(true);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			// When continueOnFail is true and an error occurs, the node returns
			// whatever was successfully processed (empty array if error on first item)
			expect(result[0]).toHaveLength(0);
			expect(ctx.continueOnFail).toHaveBeenCalled();
		});
	});
});
