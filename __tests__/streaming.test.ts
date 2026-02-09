import { IExecuteFunctions } from 'n8n-workflow';
import { Mastodon } from '../nodes/Mastodon/Mastodon.node';

describe('Mastodon Node - Streaming', () => {
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

	it('should stream public timeline', async () => {
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
			if (param === 'resource') return 'streaming';
			if (param === 'operation') return 'public';
			if (param === 'additionalFields') return defaultValue || {};
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue({});

		await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'GET',
				uri: expect.stringContaining('/api/v1/streaming/public'),
			}),
		);
	});

	it('should stream hashtag timeline', async () => {
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
			if (param === 'resource') return 'streaming';
			if (param === 'operation') return 'hashtag';
			if (param === 'tag') return 'n8n';
			if (param === 'additionalFields') return defaultValue || {};
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue({});

		await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'GET',
				uri: expect.stringContaining('/api/v1/streaming/hashtag'),
			}),
		);
	});

	it('should stream user timeline', async () => {
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
			if (param === 'resource') return 'streaming';
			if (param === 'operation') return 'user';
			if (param === 'additionalFields') return defaultValue || {};
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue({});

		await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'GET',
				uri: expect.stringContaining('/api/v1/streaming/user'),
			}),
		);
	});
});
