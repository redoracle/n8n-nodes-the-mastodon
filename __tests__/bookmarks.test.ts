import { Mastodon } from '../nodes/Mastodon/Mastodon.node';
import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';

describe('Mastodon Node - Bookmarks', () => {
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

	it('should add a bookmark', async () => {
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) =>
			param === 'resource'
				? 'bookmarks'
				: param === 'operation'
					? 'addBookmark'
					: param === 'statusId'
						? '123'
						: undefined,
		);
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue({ id: '123', bookmarked: true });

		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'POST',
				uri: expect.stringContaining('/api/v1/statuses/123/bookmark'),
			}),
		);
	});

	it('should get bookmarks', async () => {
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
			if (param === 'resource') return 'bookmarks';
			if (param === 'operation') return 'getBookmarks';
			if (param === 'max_id') return defaultValue;
			if (param === 'since_id') return defaultValue;
			if (param === 'min_id') return defaultValue;
			if (param === 'limit') return defaultValue;
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue([{ id: 'b1' }]);

		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'GET',
				uri: expect.stringContaining('/api/v1/bookmarks'),
			}),
		);
		expect(result[0][0].json).toEqual({ id: 'b1' });
	});

	it('should remove a bookmark', async () => {
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) =>
			param === 'resource'
				? 'bookmarks'
				: param === 'operation'
					? 'removeBookmark'
					: param === 'statusId'
						? '123'
						: undefined,
		);
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue({ id: '123', bookmarked: false });

		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'POST',
				uri: expect.stringContaining('/api/v1/statuses/123/unbookmark'),
			}),
		);
	});

	it('should throw on missing statusId', async () => {
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'bookmarks';
			if (param === 'operation') return 'addBookmark';
			return undefined;
		});

		// Handle the error directly to avoid timeout issues
		try {
			await node.execute.call(ctx as IExecuteFunctions);
			// If we reach this point, the test should fail as an error was expected
			expect(true).toBe(false);
		} catch (error) {
			expect(error).toBeInstanceOf(NodeOperationError);
		}
	});
});
