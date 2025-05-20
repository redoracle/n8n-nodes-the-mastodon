import { Mastodon } from '../nodes/Mastodon/Mastodon.node';
import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

describe('Mastodon Node - Timeline', () => {
	let node: Mastodon;
	let ctx: Partial<IExecuteFunctions>;

	beforeEach(() => {
		node = new Mastodon();
		ctx = {
			getNodeParameter: jest.fn().mockImplementation((param) => {
				if (param === 'resource') return 'timeline';
				if (param === 'additionalFields') return {};
				return undefined;
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			helpers: { requestOAuth2: jest.fn() } as any,
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
				}) as any,
		};
	});

	it('should fetch public timeline', async () => {
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) =>
			param === 'operation' ? 'public' : param === 'resource' ? 'timeline' : undefined,
		);
		const mockResponse = [{ content: 'post' }];
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'GET',
				uri: expect.stringContaining('/api/v1/timelines/public'),
			}),
		);
		expect(result?.[0]?.[0].json).toEqual(mockResponse[0]);
	});

	it('should fetch public timeline with remote', async () => {
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'operation') return 'public';
			if (param === 'additionalFields') return { remote: true };
			if (param === 'resource') return 'timeline';
			return undefined;
		});
		const mockResponse = [{ content: 'remote' }];
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'GET',
				uri: expect.stringContaining('/api/v1/timelines/public'),
				qs: expect.objectContaining({ remote: true }),
			}),
		);
		expect(result?.[0]?.[0].json).toEqual(mockResponse[0]);
	});

	it('should fetch hashtag timeline', async () => {
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'operation') return 'hashtag';
			if (param === 'hashtag') return 'vuejs';
			if (param === 'resource') return 'timeline';
			return undefined;
		});
		const mockResponse = [{ content: 'tagged' }];
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'GET',
				uri: expect.stringContaining('/api/v1/timelines/tag/vuejs'),
			}),
		);
		expect(result?.[0]?.[0].json).toEqual(mockResponse[0]);
	});

	it('should fetch hashtag timeline with any/all/none/remote', async () => {
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'operation') return 'hashtag';
			if (param === 'hashtag') return 'cats';
			if (param === 'additionalFields')
				return {
					any: ['dogs', 'pets'],
					all: ['cute'],
					none: ['boring'],
					remote: true,
				};
			if (param === 'resource') return 'timeline';
			return undefined;
		});
		const mockResponse = [{ content: 'hashtag-advanced' }];
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'GET',
				uri: expect.stringContaining('/api/v1/timelines/tag/cats'),
				qs: expect.objectContaining({
					any: ['dogs', 'pets'],
					all: ['cute'],
					none: ['boring'],
					remote: true,
				}),
			}),
		);
		expect(result?.[0]?.[0].json).toEqual(mockResponse[0]);
	});

	it('should fetch home timeline', async () => {
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) =>
			param === 'operation' ? 'home' : param === 'resource' ? 'timeline' : undefined,
		);
		const mockResponse = [{ content: 'home' }];
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'GET',
				uri: expect.stringContaining('/api/v1/timelines/home'),
			}),
		);
		expect(result?.[0]?.[0].json).toEqual(mockResponse[0]);
	});

	it('should fetch list timeline', async () => {
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'operation') return 'list';
			if (param === 'listId') return '55';
			if (param === 'resource') return 'timeline';
			return undefined;
		});
		const mockResponse = [{ content: 'list' }];
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'GET',
				uri: expect.stringContaining('/api/v1/timelines/list/55'),
			}),
		);
		expect(result?.[0]?.[0].json).toEqual(mockResponse[0]);
	});

	it('should fetch link timeline', async () => {
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'operation') return 'link';
			if (param === 'url') return 'https://example.com';
			if (param === 'resource') return 'timeline';
			return undefined;
		});
		const mockResponse = [{ content: 'link' }];
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'GET',
				uri: expect.stringContaining('/api/v1/timelines/link'),
			}),
		);
		expect(result?.[0]?.[0].json).toEqual(mockResponse[0]);
	});

	it('should throw on unsupported operation', async () => {
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) =>
			param === 'operation' ? 'invalidOp' : 'timeline',
		);
		await expect(node.execute.call(ctx as IExecuteFunctions)).rejects.toThrow('not implemented');
	});
});
