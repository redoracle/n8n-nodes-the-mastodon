import { IExecuteFunctions } from 'n8n-workflow';
import { Mastodon } from '../nodes/Mastodon/Mastodon.node';

describe('Mastodon Node - Authentication', () => {
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

	it('should discover OAuth config', async () => {
		const config = {
			issuer: 'https://mastodon.social',
			authorization_endpoint: 'https://mastodon.social/oauth/authorize',
			token_endpoint: 'https://mastodon.social/oauth/token',
			scopes_supported: ['read', 'write'],
			response_types_supported: ['code'],
			code_challenge_methods_supported: ['S256'],
			grant_types_supported: ['authorization_code'],
		};
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'authentication';
			if (param === 'operation') return 'discoverOAuthConfig';
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(config);

		const result = await node.execute.call(ctx as IExecuteFunctions);

		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'GET',
				uri: expect.stringContaining('/.well-known/oauth-authorization-server'),
			}),
		);
		expect(result[0][0].json).toEqual(config);
	});

	it('should register an OAuth application', async () => {
		const mockAppResponse = { id: 'app1', client_id: 'cid', client_secret: 'secret' };

		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'authentication';
			if (param === 'operation') return 'registerApp';
			if (param === 'authType') return 'oAuth2';
			if (param === 'clientName') return 'n8n';
			if (param === 'redirectUris') return 'urn:ietf:wg:oauth:2.0:oob';
			if (param === 'scopes') return 'read write';
			if (param === 'website') return 'https://example.com';
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockAppResponse);

		const result = await node.execute.call(ctx as IExecuteFunctions);

		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'POST',
				uri: expect.stringContaining('/api/v1/apps'),
			}),
		);
		expect(result[0][0].json).toMatchObject({ id: 'app1', client_id: 'cid' });
	});

	it('should obtain an access token', async () => {
		const mockTokenResponse = {
			access_token: 'token',
			token_type: 'Bearer',
			scope: 'read',
			scopes: ['read'],
		};

		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'authentication';
			if (param === 'operation') return 'obtainToken';
			if (param === 'authType') return 'oAuth2';
			if (param === 'clientId') return 'cid';
			if (param === 'clientSecret') return 'secret';
			if (param === 'code') return 'code';
			if (param === 'redirectUri') return 'urn:ietf:wg:oauth:2.0:oob';
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockTokenResponse);

		const result = await node.execute.call(ctx as IExecuteFunctions);

		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'POST',
				uri: expect.stringContaining('/oauth/token'),
			}),
		);
		expect(result[0][0].json).toMatchObject({ access_token: 'token' });
	});

	it('should revoke a token', async () => {
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'authentication';
			if (param === 'operation') return 'revokeToken';
			if (param === 'clientId') return 'cid';
			if (param === 'clientSecret') return 'secret';
			if (param === 'token') return 'token';
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue({});

		const result = await node.execute.call(ctx as IExecuteFunctions);

		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'POST',
				uri: expect.stringContaining('/oauth/revoke'),
			}),
		);
		expect(result[0][0].json).toEqual({});
	});
});
