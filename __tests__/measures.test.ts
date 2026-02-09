import { IExecuteFunctions } from 'n8n-workflow';
import { Mastodon } from '../nodes/Mastodon/Mastodon.node';
import { ResponseCache } from '../nodes/Mastodon/Mastodon_Methods';

describe('Mastodon Node - Measures', () => {
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

	it('should list measures', async () => {
		const mockMeasures = [{ key: 'active_users' }];
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'measures';
			if (param === 'operation') return 'listMeasures';
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockMeasures);

		const result = await node.execute.call(ctx as IExecuteFunctions);

		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'GET',
				uri: expect.stringContaining('/api/v1/admin/measures'),
			}),
		);
		expect(result[0][0].json).toEqual(mockMeasures[0]);
	});

	it('should get measure metrics', async () => {
		const mockMetrics = { id: 'measure1', data: [] };
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'measures';
			if (param === 'operation') return 'getMeasureMetrics';
			if (param === 'measureId') return 'measure1';
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockMetrics);

		const result = await node.execute.call(ctx as IExecuteFunctions);

		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'GET',
				uri: expect.stringContaining('/api/v1/admin/measures/measure1'),
			}),
		);
		expect(result[0][0].json).toEqual(mockMetrics);
	});

	// Edge case tests
	it('should handle empty array response from listMeasures', async () => {
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
			if (param === 'resource') return 'measures';
			if (param === 'operation') return 'listMeasures';
			if (param === 'additionalFields') return defaultValue || {};
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockImplementation(() => Promise.resolve([]));

		const result = await node.execute.call(ctx as IExecuteFunctions);

		expect(result[0]).toEqual([]);
	});

	it('should throw error when API request fails and continueOnFail is false', async () => {
		const apiError = Object.assign(new Error('Unauthorized'), {
			statusCode: 401,
			code: 'UNAUTHORIZED',
		});

		(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
			if (param === 'resource') return 'measures';
			if (param === 'operation') return 'listMeasures';
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
			if (param === 'resource') return 'measures';
			if (param === 'operation') return 'listMeasures';
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

	it('should handle 404 error when getting non-existent measure metrics', async () => {
		const notFoundError = Object.assign(new Error('Not found'), {
			statusCode: 404,
			code: 'NOT_FOUND',
		});

		(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
			if (param === 'resource') return 'measures';
			if (param === 'operation') return 'getMeasureMetrics';
			if (param === 'measureId') return 'nonexistent_measure';
			if (param === 'authType') return 'oAuth2';
			if (param === 'url') return 'https://mastodon.social';
			if (param === 'additionalFields') return defaultValue || {};
			return undefined;
		});
		ctx.continueOnFail = jest.fn().mockReturnValue(false);
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockRejectedValue(notFoundError);

		await expect(node.execute.call(ctx as IExecuteFunctions)).rejects.toThrow(
			'The requested nonexistent_measure was not found. Please verify the ID or handle is correct.',
		);
	});

	it('should handle listMeasures with multiple measures response', async () => {
		const mockMetrics = [
			{ key: 'active_users', data: [{ date: '2024-01-01', value: '100' }] },
			{ key: 'new_users', data: [{ date: '2024-01-01', value: '50' }] },
		];

		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'measures';
			if (param === 'operation') return 'listMeasures';
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockImplementation(() =>
			Promise.resolve(mockMetrics),
		);

		const result = await node.execute.call(ctx as IExecuteFunctions);

		expect(result[0]).toHaveLength(2);
		expect(result[0][0].json).toEqual(mockMetrics[0]);
		expect(result[0][1].json).toEqual(mockMetrics[1]);
	});

	it('should handle forbidden error (403) for unauthorized measure access', async () => {
		const forbiddenError = Object.assign(new Error('Forbidden'), {
			statusCode: 403,
			code: 'FORBIDDEN',
		});

		(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
			if (param === 'resource') return 'measures';
			if (param === 'operation') return 'getMeasureMetrics';
			if (param === 'measureId') return 'restricted_measure';
			if (param === 'authType') return 'oAuth2';
			if (param === 'url') return 'https://mastodon.social';
			if (param === 'additionalFields') return defaultValue || {};
			return undefined;
		});
		ctx.continueOnFail = jest.fn().mockReturnValue(false);
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockRejectedValue(forbiddenError);

		await expect(node.execute.call(ctx as IExecuteFunctions)).rejects.toThrow(
			'Insufficient OAuth2 scope: Please ensure your Mastodon app and credentials have all required permissions for this operation.',
		);
	});
});
