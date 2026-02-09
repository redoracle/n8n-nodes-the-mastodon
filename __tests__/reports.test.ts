import { IExecuteFunctions } from 'n8n-workflow';
import { Mastodon } from '../nodes/Mastodon/Mastodon.node';

describe('Mastodon Node - Reports', () => {
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

	it('should create a report', async () => {
		const mockReport = { id: 'r1', action_taken: false };
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
			if (param === 'resource') return 'reports';
			if (param === 'operation') return 'create';
			if (param === 'accountId') return 'acc1';
			if (param === 'comment') return 'spam';
			if (param === 'additionalFields') return defaultValue || {};
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockReport);

		const result = await node.execute.call(ctx as IExecuteFunctions);

		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'POST',
				uri: expect.stringContaining('/api/v1/reports'),
			}),
		);
		expect(result[0][0].json).toEqual(mockReport);
	});

	it('should list reports', async () => {
		const mockReports = [{ id: 'r2' }];
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
			if (param === 'resource') return 'reports';
			if (param === 'operation') return 'listReports';
			if (param === 'additionalFields') return defaultValue || {};
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockReports);

		const result = await node.execute.call(ctx as IExecuteFunctions);

		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'GET',
				uri: expect.stringContaining('/api/v1/admin/reports'),
			}),
		);
		expect(result[0][0].json).toEqual(mockReports[0]);
	});

	it('should resolve a report', async () => {
		const mockReport = { id: 'r3', action_taken: true };
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
			if (param === 'resource') return 'reports';
			if (param === 'operation') return 'resolveReport';
			if (param === 'reportId') return 'r3';
			return defaultValue !== undefined ? defaultValue : undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockReport);

		const result = await node.execute.call(ctx as IExecuteFunctions);

		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'POST',
				uri: expect.stringContaining('/api/v1/admin/reports/r3/resolve'),
			}),
		);
		expect(result[0][0].json).toEqual(mockReport);
	});
});
