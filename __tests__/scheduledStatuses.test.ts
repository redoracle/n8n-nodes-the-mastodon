import { IExecuteFunctions } from 'n8n-workflow';
import { Mastodon } from '../nodes/Mastodon/Mastodon.node';

describe('Mastodon Node - Scheduled Statuses', () => {
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

	it('should list scheduled statuses', async () => {
		const mockResponse = [{ id: 's1' }];
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
			if (param === 'resource') return 'scheduledStatuses';
			if (param === 'operation') return 'list';
			if (param === 'additionalFields') return defaultValue || {};
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'GET',
				uri: expect.stringContaining('/api/v1/scheduled_statuses'),
			}),
		);
		expect(result[0][0].json).toEqual(mockResponse[0]);
	});

	it('should view a scheduled status', async () => {
		const mockResponse = { id: 's2' };
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'scheduledStatuses';
			if (param === 'operation') return 'view';
			if (param === 'statusId') return 's2';
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'GET',
				uri: expect.stringContaining('/api/v1/scheduled_statuses/s2'),
			}),
		);
		expect(result[0][0].json).toEqual(mockResponse);
	});

	it('should update a scheduled status', async () => {
		const mockResponse = { id: 's3' };
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'scheduledStatuses';
			if (param === 'operation') return 'update';
			if (param === 'statusId') return 's3';
			if (param === 'scheduledAt') return '2026-12-31T10:00:00Z';
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'PUT',
				uri: expect.stringContaining('/api/v1/scheduled_statuses/s3'),
				body: expect.objectContaining({
					scheduled_at: '2026-12-31T10:00:00Z',
				}),
			}),
		);
		expect(result[0][0].json).toEqual(mockResponse);
	});

	it('should cancel a scheduled status', async () => {
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'scheduledStatuses';
			if (param === 'operation') return 'cancel';
			if (param === 'statusId') return 's4';
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue({});

		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'DELETE',
				uri: expect.stringContaining('/api/v1/scheduled_statuses/s4'),
			}),
		);
		expect(result[0]).toHaveLength(1);
		expect(result[0][0].json).toEqual({});
	});
});
