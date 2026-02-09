import { IExecuteFunctions } from 'n8n-workflow';
import { Mastodon } from '../nodes/Mastodon/Mastodon.node';

describe('Mastodon Node - Tags', () => {
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

	it('should get tag info', async () => {
		const mockTag = { name: 'n8n' };
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'tags';
			if (param === 'operation') return 'get';
			if (param === 'tagId') return 'n8n';
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockTag);

		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'GET',
				uri: expect.stringContaining('/api/v1/tags/n8n'),
			}),
		);
		expect(result[0][0].json).toEqual(mockTag);
	});

	it('should follow a tag', async () => {
		const mockTag = { name: 'n8n', following: true };
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'tags';
			if (param === 'operation') return 'follow';
			if (param === 'tagId') return 'n8n';
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockTag);

		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'POST',
				uri: expect.stringContaining('/api/v1/tags/n8n/follow'),
			}),
		);
		expect(result[0][0].json).toEqual(mockTag);
	});

	it('should unfollow a tag', async () => {
		const mockTag = { name: 'n8n', following: false };
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'tags';
			if (param === 'operation') return 'unfollow';
			if (param === 'tagId') return 'n8n';
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockTag);

		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'POST',
				uri: expect.stringContaining('/api/v1/tags/n8n/unfollow'),
			}),
		);
		expect(result[0][0].json).toEqual(mockTag);
	});
});
