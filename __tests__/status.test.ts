import { IExecuteFunctions } from 'n8n-workflow';
import { Mastodon } from '../nodes/Mastodon/Mastodon.node';

describe('Mastodon Node - Status', () => {
	let node: Mastodon;
	let ctx: Partial<IExecuteFunctions>;

	beforeEach(() => {
		node = new Mastodon();
		ctx = {
			getNodeParameter: jest.fn(),
			getInputData: jest.fn(),
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

	it('should create a status', async () => {
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'status';
			if (param === 'operation') return 'create';
			if (param === 'status') return 'Hello';
			if (param === 'additionalFields') return {}; // Add empty additionalFields
			return undefined;
		});
		(ctx.getInputData as jest.Mock).mockReturnValue([{ json: {} }]);
		const mockResponse = [{ id: '1', content: 'Hello' }];
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalled();
		expect(result?.[0]?.[0].json).toEqual(mockResponse[0]);
	});

	it('should throw for invalid status id on bookmark', async () => {
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'status';
			if (param === 'operation') return 'bookmark';
			if (param === 'statusId') return '';
			return undefined;
		});
		(ctx.getInputData as jest.Mock).mockReturnValue([{ json: {} }]);
		try {
			await node.execute.call(ctx as IExecuteFunctions);
			expect(true).toBe(false);
		} catch (error) {
			expect(error).toBeInstanceOf(Error);
		}
	});

	it('should delete a status', async () => {
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'status';
			if (param === 'operation') return 'delete';
			if (param === 'statusId') return '123';
			return undefined;
		});
		(ctx.getInputData as jest.Mock).mockReturnValue([{ json: {} }]);
		const mockResponse = [{ id: '123', deleted: true }];
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);
		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalled();
		expect(result?.[0]?.[0].json).toEqual(mockResponse[0]);
	});

	it('should favourite and unfavourite a status', async () => {
		// favourite
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'status';
			if (param === 'operation') return 'favourite';
			if (param === 'statusId') return '200';
			return undefined;
		});
		(ctx.getInputData as jest.Mock).mockReturnValue([{ json: {} }]);
		const favResponse = [{ id: '200', favourited: true }];
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(favResponse);
		let result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'POST',
				uri: expect.stringContaining('/api/v1/statuses/200/favourite'),
			}),
		);
		expect(result?.[0]?.[0].json).toEqual(favResponse[0]);

		// unfavourite
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'status';
			if (param === 'operation') return 'unfavourite';
			if (param === 'statusId') return '200';
			return undefined;
		});
		(ctx.getInputData as jest.Mock).mockReturnValue([{ json: {} }]);
		const unfavResponse = [{ id: '200', favourited: false }];
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(unfavResponse);
		result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'POST',
				uri: expect.stringContaining('/api/v1/statuses/200/unfavourite'),
			}),
		);
		expect(result?.[0]?.[0].json).toEqual(unfavResponse[0]);
	});

	it('should boost and unboost a status', async () => {
		// boost
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'status';
			if (param === 'operation') return 'boost';
			if (param === 'statusId') return '300';
			return undefined;
		});
		(ctx.getInputData as jest.Mock).mockReturnValue([{ json: {} }]);
		const boostResponse = { id: '300', reblogged: true };
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(boostResponse);
		let result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'POST',
				uri: expect.stringContaining('/api/v1/statuses/300/reblog'),
			}),
		);
		expect(result?.[0]?.[0].json).toEqual(boostResponse);

		// unboost
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'status';
			if (param === 'operation') return 'unboost';
			if (param === 'statusId') return '300';
			return undefined;
		});
		(ctx.getInputData as jest.Mock).mockReturnValue([{ json: {} }]);
		const unboostResponse = { id: '300', reblogged: false };
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(unboostResponse);
		result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'POST',
				uri: expect.stringContaining('/api/v1/statuses/300/unreblog'),
			}),
		);
		expect(result?.[0]?.[0].json).toEqual(unboostResponse);
	});

	describe('additional operations', () => {
		it('should view a status', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'status';
				if (param === 'operation') return 'view';
				if (param === 'statusId') return '400';
				return undefined;
			});
			(ctx.getInputData as jest.Mock).mockReturnValue([{ json: {} }]);
			const mockResponse = { id: '400', content: 'Hello' };
			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

			const result = await node.execute.call(ctx as IExecuteFunctions);
			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					method: 'GET',
					uri: expect.stringContaining('/api/v1/statuses/400'),
				}),
			);
			expect(result?.[0]?.[0].json).toEqual(mockResponse);
		});

		it('should edit a status', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'status';
				if (param === 'operation') return 'edit';
				if (param === 'statusId') return '401';
				if (param === 'status') return 'Updated';
				if (param === 'additionalFields') return {};
				return undefined;
			});
			(ctx.getInputData as jest.Mock).mockReturnValue([{ json: {} }]);
			const mockResponse = { id: '401', content: 'Updated' };
			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

			const result = await node.execute.call(ctx as IExecuteFunctions);
			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					method: 'PUT',
					uri: expect.stringContaining('/api/v1/statuses/401'),
				}),
			);
			expect(result?.[0]?.[0].json).toEqual(mockResponse);
		});

		it('should view edit history', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'status';
				if (param === 'operation') return 'viewEditHistory';
				if (param === 'statusId') return '402';
				return undefined;
			});
			(ctx.getInputData as jest.Mock).mockReturnValue([{ json: {} }]);
			const mockResponse = [{ content: 'v1' }, { content: 'v2' }];
			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

			const result = await node.execute.call(ctx as IExecuteFunctions);
			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					method: 'GET',
					uri: expect.stringContaining('/api/v1/statuses/402/history'),
				}),
			);
			expect(result?.[0]?.[0].json).toEqual(mockResponse[0]);
		});

		it('should view status source', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'status';
				if (param === 'operation') return 'viewSource';
				if (param === 'statusId') return '403';
				return undefined;
			});
			(ctx.getInputData as jest.Mock).mockReturnValue([{ json: {} }]);
			const mockResponse = { id: '403', text: 'raw' };
			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

			const result = await node.execute.call(ctx as IExecuteFunctions);
			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					method: 'GET',
					uri: expect.stringContaining('/api/v1/statuses/403/source'),
				}),
			);
			expect(result?.[0]?.[0].json).toEqual(mockResponse);
		});

		it('should get status context', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'status';
				if (param === 'operation') return 'context';
				if (param === 'statusId') return '404';
				if (param === 'additionalOptions') return { returnFormat: 'structured' };
				return undefined;
			});
			(ctx.getInputData as jest.Mock).mockReturnValue([{ json: {} }]);
			const mockResponse = { ancestors: [], descendants: [] };
			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

			const result = await node.execute.call(ctx as IExecuteFunctions);
			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					method: 'GET',
					uri: expect.stringContaining('/api/v1/statuses/404/context'),
				}),
			);
			expect(result?.[0]?.[0].json.ancestors).toEqual([]);
		});

		it('should bookmark a status', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'status';
				if (param === 'operation') return 'bookmark';
				if (param === 'statusId') return '405';
				return undefined;
			});
			(ctx.getInputData as jest.Mock).mockReturnValue([{ json: {} }]);
			const mockResponse = { id: '405', bookmarked: true };
			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

			const result = await node.execute.call(ctx as IExecuteFunctions);
			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					method: 'POST',
					uri: expect.stringContaining('/api/v1/statuses/405/bookmark'),
				}),
			);
			expect(result?.[0]?.[0].json).toEqual(mockResponse);
		});

		it('should upload media for status', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'status';
				if (param === 'operation') return 'mediaUpload';
				if (param === 'binaryPropertyName') return 'data';
				return undefined;
			});
			(ctx.getInputData as jest.Mock).mockReturnValue([
				{
					json: {},
					binary: {
						data: {
							fileName: 'file.png',
							mimeType: 'image/png',
							data: Buffer.from('x').toString('base64'),
						},
					},
				},
			]);
			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue({ id: 'media1' });

			const result = await node.execute.call(ctx as IExecuteFunctions);
			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					method: 'POST',
					uri: expect.stringContaining('/api/v1/media'),
				}),
			);
			expect(result?.[0]?.[0].json).toEqual({ id: 'media1' });
		});

		it('should list scheduled statuses', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'status';
				if (param === 'operation') return 'scheduledStatuses';
				return undefined;
			});
			(ctx.getInputData as jest.Mock).mockReturnValue([{ json: {} }]);
			const mockResponse = [{ id: 's1' }];
			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

			const result = await node.execute.call(ctx as IExecuteFunctions);
			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					method: 'GET',
					uri: expect.stringContaining('/api/v1/scheduled_statuses'),
				}),
			);
			expect(result?.[0]?.[0].json).toEqual(mockResponse[0]);
		});

		it('should search statuses', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'status';
				if (param === 'operation') return 'search';
				if (param === 'query') return 'hello';
				return undefined;
			});
			(ctx.getInputData as jest.Mock).mockReturnValue([{ json: {} }]);
			const mockResponse = { statuses: [{ id: 's1' }] };
			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

			const result = await node.execute.call(ctx as IExecuteFunctions);
			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					method: 'GET',
					uri: expect.stringContaining('/api/v2/search'),
				}),
			);
			expect(result?.[0]?.[0].json).toEqual(mockResponse);
		});
	});

	it('should count URLs as 23 characters no matter their length, per Mastodon character counting	', async () => {
		const { ValidationUtils } = await import('../nodes/Mastodon/Mastodon_Methods');
		const text = 'https://example.com/' + 'a'.repeat(500);

		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'status';
			if (param === 'operation') return 'create';
			if (param === 'status') return text;
			if (param === 'additionalFields') return {};
			return undefined;
		});
		(ctx.getInputData as jest.Mock).mockReturnValue([{ json: {} }]);
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue({ id: '1', content: text });

		await node.execute.call(ctx as IExecuteFunctions);

		const requestCall = (ctx.helpers!.requestOAuth2 as jest.Mock).mock.calls[0][1];
		const sentStatus = requestCall.body.status;

		// New behavior: URL should be preserved
		expect(sentStatus).toContain(text);

		// Effective length should be 23 since it's only a single really long URL
		const effectiveLength = ValidationUtils.calculateMastodonLength(sentStatus);
		expect(effectiveLength).toEqual(23);
	});
});
