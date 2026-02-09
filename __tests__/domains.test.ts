import { IExecuteFunctions } from 'n8n-workflow';
import { Mastodon } from '../nodes/Mastodon/Mastodon.node';

describe('Mastodon Node - Domains', () => {
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

	it('should list allowed domains', async () => {
		const mockResponse = [{ id: 'ad1' }];
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
			if (param === 'resource') return 'allowedDomains';
			if (param === 'operation') return 'listAllowedDomains';
			if (param === 'additionalFields') return defaultValue || {};
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'GET',
				uri: expect.stringContaining('/api/v1/admin/domain_allows'),
			}),
		);
		expect(result[0][0].json).toEqual(mockResponse[0]);
	});

	it('should get allowed domain', async () => {
		const mockResponse = { id: 'ad2' };
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'allowedDomains';
			if (param === 'operation') return 'getAllowedDomain';
			if (param === 'domainId') return 'ad2';
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'GET',
				uri: expect.stringContaining('/api/v1/admin/domain_allows/ad2'),
			}),
		);
		expect(result[0][0].json).toEqual(mockResponse);
	});

	it('should list blocked domains', async () => {
		const mockResponse = [{ id: 'bd1' }];
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
			if (param === 'resource') return 'blockedDomains';
			if (param === 'operation') return 'listBlockedDomains';
			if (param === 'additionalFields') return defaultValue || {};
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'GET',
				uri: expect.stringContaining('/api/v1/admin/domain_blocks'),
			}),
		);
		expect(result[0][0].json).toEqual(mockResponse[0]);
	});

	it('should get blocked domain', async () => {
		const mockResponse = { id: 'bd2' };
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'blockedDomains';
			if (param === 'operation') return 'getBlockedDomain';
			if (param === 'domainId') return 'bd2';
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'GET',
				uri: expect.stringContaining('/api/v1/admin/domain_blocks/bd2'),
			}),
		);
		expect(result[0][0].json).toEqual(mockResponse);
	});

	it('should block a domain', async () => {
		const mockResponse = { id: 'bd3' };
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
			if (param === 'resource') return 'blockedDomains';
			if (param === 'operation') return 'blockDomain';
			if (param === 'domain') return 'spam.example';
			if (param === 'blockOptions') return defaultValue || {};
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'POST',
				uri: expect.stringContaining('/api/v1/admin/domain_blocks'),
				body: expect.objectContaining({
					domain: 'spam.example',
				}),
			}),
		);
		expect(result[0][0].json).toEqual(mockResponse);
	});

	it('should list email blocked domains', async () => {
		const mockResponse = [{ id: 'eb1' }];
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
			if (param === 'resource') return 'emailBlockedDomains';
			if (param === 'operation') return 'listEmailBlockedDomains';
			if (param === 'additionalFields') return defaultValue || {};
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'GET',
				uri: expect.stringContaining('/api/v1/admin/email_domain_blocks'),
			}),
		);
		expect(result[0][0].json).toEqual(mockResponse[0]);
	});

	it('should get email blocked domain', async () => {
		const mockResponse = { id: 'eb2' };
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'emailBlockedDomains';
			if (param === 'operation') return 'getEmailBlockedDomain';
			if (param === 'domainId') return 'eb2';
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'GET',
				uri: expect.stringContaining('/api/v1/admin/email_domain_blocks/eb2'),
			}),
		);
		expect(result[0][0].json).toEqual(mockResponse);
	});

	describe('error handling', () => {
		it('should throw error when blocked domain not found (404) and continueOnFail is false', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'blockedDomains';
				if (param === 'operation') return 'getBlockedDomain';
				if (param === 'domainId') return 'nonexistent';
				if (param === 'authType') return 'oAuth2';
				if (param === 'url') return 'https://mastodon.social';
				return undefined;
			});
			const httpError = Object.assign(new Error('Not Found'), {
				statusCode: 404,
				code: 'NOT_FOUND',
			});
			(ctx.helpers!.requestOAuth2 as jest.Mock).mockRejectedValue(httpError);
			ctx.continueOnFail = jest.fn().mockReturnValue(false);

			await expect(node.execute.call(ctx as IExecuteFunctions)).rejects.toThrow();
		});

		it('should throw error when unauthorized (401) and continueOnFail is false', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
				if (param === 'resource') return 'allowedDomains';
				if (param === 'operation') return 'listAllowedDomains';
				if (param === 'additionalFields') return defaultValue || {};
				if (param === 'authType') return 'oAuth2';
				if (param === 'url') return 'https://mastodon.social';
				return undefined;
			});
			const httpError = Object.assign(new Error('Unauthorized'), {
				statusCode: 401,
				code: 'UNAUTHORIZED',
			});
			(ctx.helpers!.requestOAuth2 as jest.Mock).mockRejectedValue(httpError);
			ctx.continueOnFail = jest.fn().mockReturnValue(false);

			await expect(node.execute.call(ctx as IExecuteFunctions)).rejects.toThrow();
		});

		it('should return empty result when error occurs and continueOnFail is true', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
				if (param === 'resource') return 'blockedDomains';
				if (param === 'operation') return 'blockDomain';
				if (param === 'domain') return 'spam.example';
				if (param === 'blockOptions') return defaultValue || {};
				if (param === 'authType') return 'oAuth2';
				if (param === 'url') return 'https://mastodon.social';
				return undefined;
			});
			const httpError = Object.assign(new Error('Server Error'), {
				statusCode: 500,
				code: 'INTERNAL_SERVER_ERROR',
			});
			(ctx.helpers!.requestOAuth2 as jest.Mock).mockRejectedValue(httpError);
			ctx.continueOnFail = jest.fn().mockReturnValue(true);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(result[0]).toHaveLength(0);
			expect(ctx.continueOnFail).toHaveBeenCalled();
		});
	});

	describe('edge cases with options', () => {
		it('should block domain with all blockOptions specified', async () => {
			const mockResponse = {
				id: 'bd4',
				domain: 'evil.example',
				severity: 'suspend',
				reject_media: true,
				reject_reports: true,
			};
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
				if (param === 'resource') return 'blockedDomains';
				if (param === 'operation') return 'blockDomain';
				if (param === 'domain') return 'evil.example';
				if (param === 'blockOptions')
					return {
						severity: 'suspend',
						reject_media: true,
						reject_reports: true,
						private_comment: 'Internal note',
						public_comment: 'Spam domain',
						obfuscate: true,
					};
				return undefined;
			});
			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					method: 'POST',
					uri: expect.stringContaining('/api/v1/admin/domain_blocks'),
					body: expect.objectContaining({
						domain: 'evil.example',
						severity: 'suspend',
						reject_media: true,
						reject_reports: true,
						private_comment: 'Internal note',
						public_comment: 'Spam domain',
						obfuscate: true,
					}),
				}),
			);
			expect(result[0][0].json).toEqual(mockResponse);
		});

		it('should list allowed domains with pagination options', async () => {
			const mockResponse = [{ id: 'ad3' }, { id: 'ad4' }];
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
				if (param === 'resource') return 'allowedDomains';
				if (param === 'operation') return 'listAllowedDomains';
				if (param === 'additionalFields')
					return {
						limit: 20,
						max_id: 'ad10',
						since_id: 'ad1',
					};
				return undefined;
			});
			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					method: 'GET',
					uri: expect.stringContaining('/api/v1/admin/domain_allows'),
					qs: expect.objectContaining({
						limit: 20,
						max_id: 'ad10',
						since_id: 'ad1',
					}),
				}),
			);
			expect(result[0]).toHaveLength(2);
			expect(result[0][0].json).toEqual(mockResponse[0]);
			expect(result[0][1].json).toEqual(mockResponse[1]);
		});

		it('should list blocked domains with limit option', async () => {
			const mockResponse = [{ id: 'bd5' }, { id: 'bd6' }, { id: 'bd7' }];
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
				if (param === 'resource') return 'blockedDomains';
				if (param === 'operation') return 'listBlockedDomains';
				if (param === 'additionalFields')
					return {
						limit: 50,
						min_id: 'bd2',
					};
				return undefined;
			});
			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					method: 'GET',
					uri: expect.stringContaining('/api/v1/admin/domain_blocks'),
					qs: expect.objectContaining({
						limit: 50,
						min_id: 'bd2',
					}),
				}),
			);
			expect(result[0]).toHaveLength(3);
			expect(result[0][0].json).toEqual(mockResponse[0]);
			expect(result[0][1].json).toEqual(mockResponse[1]);
			expect(result[0][2].json).toEqual(mockResponse[2]);
		});

		it('should list email blocked domains with pagination', async () => {
			const mockResponse = [{ id: 'eb3' }];
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
				if (param === 'resource') return 'emailBlockedDomains';
				if (param === 'operation') return 'listEmailBlockedDomains';
				if (param === 'additionalFields')
					return {
						limit: 10,
						max_id: 'eb100',
					};
				return undefined;
			});
			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					method: 'GET',
					uri: expect.stringContaining('/api/v1/admin/email_domain_blocks'),
					qs: expect.objectContaining({
						limit: 10,
						max_id: 'eb100',
					}),
				}),
			);
			expect(result[0][0].json).toEqual(mockResponse[0]);
		});
	});
});
