import { IExecuteFunctions } from 'n8n-workflow';
import { Mastodon } from '../nodes/Mastodon/Mastodon.node';

describe('Mastodon Node - Apps', () => {
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

	it('should register an OAuth application', async () => {
		const mockResponse = { id: 'app1', client_id: 'cid', client_secret: 'secret' };
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'apps';
			if (param === 'operation') return 'registerApp';
			if (param === 'clientName') return 'n8n';
			if (param === 'redirectUris') return 'urn:ietf:wg:oauth:2.0:oob';
			if (param === 'scopes') return 'read write';
			if (param === 'website') return 'https://example.com';
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

		const result = await node.execute.call(ctx as IExecuteFunctions);

		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'POST',
				uri: expect.stringContaining('/api/v1/apps'),
				body: expect.objectContaining({
					client_name: 'n8n',
					redirect_uris: 'urn:ietf:wg:oauth:2.0:oob',
					scopes: 'read write',
					website: 'https://example.com',
				}),
			}),
		);
		expect(result[0][0].json).toEqual(mockResponse);
	});

	it('should verify application credentials', async () => {
		const mockResponse = { id: 'app1', name: 'n8n' };
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'apps';
			if (param === 'operation') return 'verifyCredentials';
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

		const result = await node.execute.call(ctx as IExecuteFunctions);

		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'GET',
				uri: expect.stringContaining('/api/v1/apps/verify_credentials'),
			}),
		);
		expect(result[0][0].json).toEqual(mockResponse);
	});
});
