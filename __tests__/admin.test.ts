import { IExecuteFunctions } from 'n8n-workflow';
import { Mastodon } from '../nodes/Mastodon/Mastodon.node';

describe('Mastodon Node - Admin', () => {
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

	it('should list canonical email blocks', async () => {
		const mockResponse = [{ id: 'cb1' }];
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
			if (param === 'resource') return 'canonicalEmailBlocks';
			if (param === 'operation') return 'listBlocks';
			if (param === 'additionalFields') return defaultValue || {};
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'GET',
				uri: expect.stringContaining('/api/v1/admin/canonical_email_blocks'),
			}),
		);
		expect(result[0][0].json).toEqual(mockResponse[0]);
	});

	it('should get canonical email block', async () => {
		const mockResponse = { id: 'cb2' };
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
			if (param === 'resource') return 'canonicalEmailBlocks';
			if (param === 'operation') return 'getBlock';
			if (param === 'blockId') return 'cb2';
			if (param === 'additionalFields') return defaultValue || {};
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'GET',
				uri: expect.stringContaining('/api/v1/admin/canonical_email_blocks/cb2'),
			}),
		);
		expect(result[0][0].json).toEqual(mockResponse);
	});

	it('should get cohort retention data', async () => {
		const mockResponse = [{ period: '2026-01-01', data: [] }];
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
			if (param === 'resource') return 'cohorts';
			if (param === 'operation') return 'getRetentionData';
			if (param === 'additionalFields') return {
				frequency: 'day',
				startDate: '2026-01-01',
				endDate: '2026-01-31',
			};
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'POST',
				uri: expect.stringContaining('/api/v1/admin/retention'),
				body: expect.objectContaining({
					start_at: '2026-01-01',
					end_at: '2026-01-31',
					frequency: 'day',
				}),
			}),
		);
		expect(result[0][0].json).toEqual(mockResponse[0]);
	});

	it('should list dimensions', async () => {
		const mockResponse = [{ id: 'd1' }];
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
			if (param === 'resource') return 'dimensions';
			if (param === 'operation') return 'listAll';
			if (param === 'additionalFields') return defaultValue || {};
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'POST',
				uri: expect.stringContaining('/api/v1/admin/dimensions'),
				body: expect.objectContaining({
					keys: expect.arrayContaining(['languages', 'sources']),
				}),
			}),
		);
		expect(result[0][0].json).toEqual(mockResponse[0]);
	});

	it('should get dimension', async () => {
		const mockResponse = [{ key: 'languages', data: [] }];
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
			if (param === 'resource') return 'dimensions';
			if (param === 'operation') return 'get';
			if (param === 'dimensionId') return 'languages';
			if (param === 'additionalFields') return defaultValue || {};
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'POST',
				uri: expect.stringContaining('/api/v1/admin/dimensions'),
				body: expect.objectContaining({ keys: ['languages'] }),
			}),
		);
		expect(result[0][0].json).toEqual(mockResponse[0]);
	});

	it('should list IPs', async () => {
		const mockResponse = [{ id: 'ip1' }];
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
			if (param === 'resource') return 'ips';
			if (param === 'operation') return 'listIps';
			if (param === 'additionalFields') return defaultValue || {};
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'GET',
				uri: expect.stringContaining('/api/v1/admin/ip_blocks'),
			}),
		);
		expect(result[0][0].json).toEqual(mockResponse[0]);
	});

	it('should get IP record', async () => {
		const mockResponse = { id: 'ip2' };
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
			if (param === 'resource') return 'ips';
			if (param === 'operation') return 'getIp';
			if (param === 'ipRecordId') return 'ip2';
			if (param === 'additionalFields') return defaultValue || {};
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'GET',
				uri: expect.stringContaining('/api/v1/admin/ip_blocks/ip2'),
			}),
		);
		expect(result[0][0].json).toEqual(mockResponse);
	});
});
