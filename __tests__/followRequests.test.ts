import { IExecuteFunctions } from 'n8n-workflow';
import { Mastodon } from '../nodes/Mastodon/Mastodon.node';
import { ResponseCache } from '../nodes/Mastodon/Mastodon_Methods';

describe('Mastodon Node - Follow Requests', () => {
	let node: Mastodon;
	let ctx: Partial<IExecuteFunctions>;

	beforeEach(() => {
		// Clear the response cache to prevent test interference
		ResponseCache.getInstance().clear();

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

	it('should list follow requests', async () => {
		const mockAccounts = [{ id: 'a1' }];
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'followRequests';
			if (param === 'operation') return 'list';
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockAccounts);

		const result = await node.execute.call(ctx as IExecuteFunctions);

		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'GET',
				uri: expect.stringContaining('/api/v1/follow_requests'),
			}),
		);
		expect(result[0][0].json).toEqual(mockAccounts[0]);
	});

	it('should accept a follow request', async () => {
		const mockRelationship = { id: 'a2', following: true };
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'followRequests';
			if (param === 'operation') return 'acceptRequest';
			if (param === 'accountId') return 'a2';
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockRelationship);

		const result = await node.execute.call(ctx as IExecuteFunctions);

		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'POST',
				uri: expect.stringContaining('/api/v1/follow_requests/a2/authorize'),
			}),
		);
		expect(result[0][0].json).toEqual(mockRelationship);
	});

	it('should reject a follow request', async () => {
		const mockRelationship = { id: 'a3', following: false };
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'followRequests';
			if (param === 'operation') return 'rejectRequest';
			if (param === 'accountId') return 'a3';
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockRelationship);

		const result = await node.execute.call(ctx as IExecuteFunctions);

		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'POST',
				uri: expect.stringContaining('/api/v1/follow_requests/a3/reject'),
			}),
		);
		expect(result[0][0].json).toEqual(mockRelationship);
	});

	// Error handling tests
	it('should throw error when API request fails and continueOnFail is false', async () => {
		const apiError = Object.assign(new Error('Unauthorized'), {
			statusCode: 401,
			code: 'UNAUTHORIZED',
		});

		(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
			if (param === 'resource') return 'followRequests';
			if (param === 'operation') return 'list';
			if (param === 'authType') return 'oAuth2';
			if (param === 'url') return 'https://mastodon.social';
			if (param === 'additionalFields') return defaultValue || {};
			return undefined;
		});
		ctx.continueOnFail = jest.fn().mockReturnValue(false);
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockRejectedValue(apiError);

		await expect(node.execute.call(ctx as IExecuteFunctions)).rejects.toThrow(
			'Authentication failed: Please reconnect your Mastodon credentials.',
		);
	});

	it('should return empty array when API request fails and continueOnFail is true', async () => {
		const apiError = Object.assign(new Error('Server error'), {
			statusCode: 500,
			code: 'SERVER_ERROR',
		});

		(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
			if (param === 'resource') return 'followRequests';
			if (param === 'operation') return 'acceptRequest';
			if (param === 'accountId') return 'a4';
			if (param === 'authType') return 'oAuth2';
			if (param === 'url') return 'https://mastodon.social';
			if (param === 'additionalFields') return defaultValue || {};
			return undefined;
		});
		ctx.continueOnFail = jest.fn().mockReturnValue(true);
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockRejectedValue(apiError);

		const result = await node.execute.call(ctx as IExecuteFunctions);

		expect(result[0]).toEqual([]);
	});

	it('should handle 404 error when rejecting non-existent follow request', async () => {
		const notFoundError = Object.assign(new Error('Not found'), {
			statusCode: 404,
			code: 'NOT_FOUND',
		});

		(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
			if (param === 'resource') return 'followRequests';
			if (param === 'operation') return 'rejectRequest';
			if (param === 'accountId') return 'nonexistent';
			if (param === 'authType') return 'oAuth2';
			if (param === 'url') return 'https://mastodon.social';
			if (param === 'additionalFields') return defaultValue || {};
			return undefined;
		});
		ctx.continueOnFail = jest.fn().mockReturnValue(false);
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockRejectedValue(notFoundError);

		await expect(node.execute.call(ctx as IExecuteFunctions)).rejects.toThrow(
			'The requested reject was not found. Please verify the ID or handle is correct.',
		);
	});

	// Edge case tests
	it('should handle empty array response from list operation', async () => {
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
			if (param === 'resource') return 'followRequests';
			if (param === 'operation') return 'list';
			if (param === 'additionalFields') return defaultValue || {};
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockImplementation(() => Promise.resolve([]));

		const result = await node.execute.call(ctx as IExecuteFunctions);

		expect(result[0]).toEqual([]);
	});

	it('should handle list operation with pagination options', async () => {
		const mockAccounts = [{ id: 'a5' }, { id: 'a6' }];
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'followRequests';
			if (param === 'operation') return 'list';
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockImplementation(() =>
			Promise.resolve(mockAccounts),
		);

		const result = await node.execute.call(ctx as IExecuteFunctions);

		expect(result[0]).toHaveLength(2);
		expect(result[0][0].json).toEqual(mockAccounts[0]);
		expect(result[0][1].json).toEqual(mockAccounts[1]);
	});
});
