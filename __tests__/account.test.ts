import { Mastodon } from '../nodes/Mastodon/Mastodon.node';
import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';

describe('Mastodon Node - Account', () => {
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

	it('should follow an account', async () => {
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'account';
			if (param === 'operation') return 'follow';
			if (param === 'accountId') return '42';
			return undefined;
		});
		const mockResponse = { id: '42', following: true };
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'POST',
				uri: expect.stringContaining('/api/v1/accounts/42/follow'),
			}),
		);
		expect(result?.[0]?.[0].json).toEqual(mockResponse);
	});

	it('should throw if accountId is missing for unfollow', async () => {
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'account';
			if (param === 'operation') return 'unfollow';
			return undefined;
		});
		try {
			await node.execute.call(ctx as IExecuteFunctions);
			expect(true).toBe(false);
		} catch (error) {
			expect(error).toBeInstanceOf(Error);
		}
	});

	describe('additional operations', () => {
		const cases: Array<{
			name: string;
			operation: string;
			method: string;
			uri: string;
			params: Record<string, unknown>;
		}> = [
			{
				name: 'block',
				operation: 'block',
				method: 'POST',
				uri: '/api/v1/accounts/42/block',
				params: { accountId: '42' },
			},
			{
				name: 'mute',
				operation: 'mute',
				method: 'POST',
				uri: '/api/v1/accounts/42/mute',
				params: { accountId: '42', additionalFields: {} },
			},
			{
				name: 'verifyCredentials',
				operation: 'verifyCredentials',
				method: 'GET',
				uri: '/api/v1/accounts/verify_credentials',
				params: {},
			},
			{
				name: 'viewProfile',
				operation: 'viewProfile',
				method: 'GET',
				uri: '/api/v1/accounts/42',
				params: { accountId: '42', additionalFields: {} },
			},
			{
				name: 'getAccountWarnings',
				operation: 'getAccountWarnings',
				method: 'GET',
				uri: '/api/v1/admin/accounts/42/warnings',
				params: { accountId: '42' },
			},
			{
				name: 'getAdminAccountInfo',
				operation: 'getAdminAccountInfo',
				method: 'GET',
				uri: '/api/v1/admin/accounts/42',
				params: { accountId: '42' },
			},
			{
				name: 'addNoteToAccount',
				operation: 'addNoteToAccount',
				method: 'POST',
				uri: '/api/v1/accounts/42/note',
				params: { accountId: '42', note: 'test' },
			},
			{
				name: 'getAccountFollowers',
				operation: 'getAccountFollowers',
				method: 'GET',
				uri: '/api/v1/accounts/42/followers',
				params: { accountId: '42' },
			},
			{
				name: 'getAccountFollowing',
				operation: 'getAccountFollowing',
				method: 'GET',
				uri: '/api/v1/accounts/42/following',
				params: { accountId: '42' },
			},
			{
				name: 'getAccountFeaturedTags',
				operation: 'getAccountFeaturedTags',
				method: 'GET',
				uri: '/api/v1/accounts/42/featured_tags',
				params: { accountId: '42' },
			},
			{
				name: 'getAccountLists',
				operation: 'getAccountLists',
				method: 'GET',
				uri: '/api/v1/accounts/42/lists',
				params: { accountId: '42' },
			},
			{
				name: 'getAccountStatuses',
				operation: 'getAccountStatuses',
				method: 'GET',
				uri: '/api/v1/accounts/42/statuses',
				params: { accountId: '42' },
			},
			{
				name: 'pinAccount',
				operation: 'pinAccount',
				method: 'POST',
				uri: '/api/v1/accounts/42/pin',
				params: { accountId: '42' },
			},
			{
				name: 'removeAccountFromFollowers',
				operation: 'removeAccountFromFollowers',
				method: 'POST',
				uri: '/api/v1/accounts/42/remove_from_followers',
				params: { accountId: '42' },
			},
			{
				name: 'searchAccounts',
				operation: 'searchAccounts',
				method: 'GET',
				uri: '/api/v1/accounts/search',
				params: { query: 'alice', limit: 5 },
			},
			{
				name: 'unmuteAccount',
				operation: 'unmuteAccount',
				method: 'POST',
				uri: '/api/v1/accounts/42/unmute',
				params: { accountId: '42' },
			},
			{
				name: 'unpinAccount',
				operation: 'unpinAccount',
				method: 'POST',
				uri: '/api/v1/accounts/42/unpin',
				params: { accountId: '42' },
			},
			{
				name: 'registerAccount',
				operation: 'registerAccount',
				method: 'POST',
				uri: '/api/v1/accounts',
				params: {
					username: 'user',
					email: 'user@example.com',
					password: 'secret',
					agreement: true,
					locale: 'en',
					reason: undefined,
					date_of_birth: undefined,
				},
			},
			{
				name: 'updateCredentials',
				operation: 'updateCredentials',
				method: 'PATCH',
				uri: '/api/v1/accounts/update_credentials',
				params: { additionalFields: {} },
			},
			{
				name: 'getMultipleAccounts',
				operation: 'getMultipleAccounts',
				method: 'GET',
				uri: '/api/v1/accounts',
				params: { ids: ['1', '2'] },
			},
			{
				name: 'getRelationships',
				operation: 'getRelationships',
				method: 'GET',
				uri: '/api/v1/accounts/relationships',
				params: { ids: ['1', '2'], with_suspended: false },
			},
			{
				name: 'getFamiliarFollowers',
				operation: 'getFamiliarFollowers',
				method: 'GET',
				uri: '/api/v1/accounts/familiar_followers',
				params: { ids: ['1', '2'] },
			},
			{
				name: 'lookupAccount',
				operation: 'lookupAccount',
				method: 'GET',
				uri: '/api/v1/accounts/lookup',
				params: { acct: 'user@example.com' },
			},
		];

		test.each(cases)('should handle $name', async ({ operation, method, uri, params }) => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
				if (param === 'resource') return 'account';
				if (param === 'operation') return operation;
				if (param in params) return params[param as keyof typeof params];
				if (param === 'additionalFields') return defaultValue || {};
				if (param === 'with_suspended') return params.with_suspended ?? defaultValue;
				if (param === 'reason') return params.reason ?? defaultValue;
				if (param === 'date_of_birth') return params.date_of_birth ?? defaultValue;
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue({ ok: true });

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					method,
					uri: expect.stringContaining(uri),
				}),
			);
			expect(result[0][0].json).toEqual({ ok: true });
		});
	});
});
