import { IExecuteFunctions } from 'n8n-workflow';
import { Mastodon } from '../nodes/Mastodon/Mastodon.node';

describe('Mastodon Node - Retention', () => {
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

	it('should view retention statistics', async () => {
		const mockStats = { day: '2024-01-01', retention: 0.5 };
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'retention';
			if (param === 'operation') return 'viewStatistics';
			if (param === 'start_at') return '2024-01-01';
			if (param === 'end_at') return '2024-01-31';
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockStats);

		const result = await node.execute.call(ctx as IExecuteFunctions);

		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'GET',
				uri: expect.stringContaining('/api/v1/admin/retention'),
			}),
		);
		expect(result[0][0].json).toEqual(mockStats);
	});

	it('should throw when retention statistics request fails', async () => {
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'retention';
			if (param === 'operation') return 'viewStatistics';
			if (param === 'start_at') return '2024-01-01';
			if (param === 'end_at') return '2024-01-31';
			return undefined;
		});
		const apiError = Object.assign(new Error('API Error'), {
			statusCode: 500,
			code: 'INTERNAL_SERVER_ERROR',
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockRejectedValue(apiError);

		await expect(node.execute.call(ctx as IExecuteFunctions)).rejects.toThrow(
			'Mastodon API error (500): API Error',
		);
	});
});
