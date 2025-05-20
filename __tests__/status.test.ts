import { Mastodon } from '../nodes/Mastodon/Mastodon.node';
import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';

describe('Mastodon Node - Status', () => {
	let node: Mastodon;
	let ctx: Partial<IExecuteFunctions>;

	beforeEach(() => {
		node = new Mastodon();
		ctx = {
			getNodeParameter: jest.fn(),
			getInputData: jest.fn(),
			helpers: { requestOAuth2: jest.fn() } as any,
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
				}) as any,
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
});
