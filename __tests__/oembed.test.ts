import { IExecuteFunctions } from 'n8n-workflow';
import { Mastodon } from '../nodes/Mastodon/Mastodon.node';
import { ResponseCache } from '../nodes/Mastodon/Mastodon_Methods';

describe('Mastodon Node - oEmbed', () => {
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

	it('should fetch oEmbed data', async () => {
		const mockResponse = { type: 'link', title: 'Post' };
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'oembed';
			if (param === 'operation') return 'fetchOembed';
			if (param === 'url') return 'https://mastodon.social/@user/1';
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

		const result = await node.execute.call(ctx as IExecuteFunctions);

		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'GET',
				uri: expect.stringContaining('/api/oembed'),
			}),
		);
		expect(Array.isArray(result)).toBe(true);
		expect(result[0]).toBeDefined();
		expect(Array.isArray(result[0])).toBe(true);
		expect(result[0][0]).toBeDefined();
		expect(result[0][0].json).toEqual(mockResponse);
	});

	it('should throw when oEmbed request fails and continueOnFail is false', async () => {
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'oembed';
			if (param === 'operation') return 'fetchOembed';
			if (param === 'url') return 'https://mastodon.social/@user/1';
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

	it('should return empty result when oEmbed request fails and continueOnFail is true', async () => {
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'oembed';
			if (param === 'operation') return 'fetchOembed';
			if (param === 'url') return 'https://mastodon.social/@user/1';
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

	it('should surface an error when url is empty', async () => {
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'oembed';
			if (param === 'operation') return 'fetchOembed';
			if (param === 'url') return '';
			return undefined;
		});
		const httpError = Object.assign(new Error('Bad Request'), {
			statusCode: 400,
			code: 'BAD_REQUEST',
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockRejectedValue(httpError);
		ctx.continueOnFail = jest.fn().mockReturnValue(false);

		await expect(node.execute.call(ctx as IExecuteFunctions)).rejects.toThrow();
	});

	it('should surface an error when url is missing', async () => {
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'oembed';
			if (param === 'operation') return 'fetchOembed';
			return undefined;
		});
		const httpError = Object.assign(new Error('Bad Request'), {
			statusCode: 400,
			code: 'BAD_REQUEST',
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockRejectedValue(httpError);
		ctx.continueOnFail = jest.fn().mockReturnValue(false);

		await expect(node.execute.call(ctx as IExecuteFunctions)).rejects.toThrow();
	});
});
