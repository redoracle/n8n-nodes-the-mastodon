import { Mastodon } from '../nodes/Mastodon/Mastodon.node';
import { IExecuteFunctions } from 'n8n-workflow';

describe('Mastodon Node - Lists', () => {
	let node: Mastodon;
	let ctx: Partial<IExecuteFunctions>;

	beforeEach(() => {
		node = new Mastodon();
		ctx = {
			getNodeParameter: jest.fn(),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			helpers: {
				requestOAuth2: jest.fn(),
				requestOAuth1: jest.fn(),
				requestWithAuthentication: jest.fn(),
				httpRequest: jest.fn(),
				httpRequestWithAuthentication: jest.fn(),
				requestWithAuthenticationPaginated: jest.fn(),
				request: jest.fn(),
				prepareBinaryData: jest.fn(),
				setBinaryDataBuffer: jest.fn(),
				getBinaryDataBuffer: jest.fn(),
				createDeferredPromise: jest.fn(),
				returnJsonArray: jest.fn(),
				copyBinaryFile: jest.fn(),
				binaryToBuffer: jest.fn(),
				binaryToString: jest.fn(),
				getBinaryPath: jest.fn(),
				getBinaryStream: jest.fn(),
				getBinaryMetadata: jest.fn(),
				checkProcessedAndRecord: jest.fn(),
				checkProcessedItemsAndRecord: jest.fn(),
				removeProcessed: jest.fn(),
				clearAllProcessedItems: jest.fn(),
				getProcessedDataCount: jest.fn(),
				createReadStream: jest.fn(),
				getStoragePath: jest.fn(),
				writeContentToFile: jest.fn(),
				getSSHClient: jest.fn(),
				normalizeItems: jest.fn(),
				constructExecutionMetaData: jest.fn(),
				assertBinaryData: jest.fn(),
				detectBinaryEncoding: jest.fn(),
				copyInputItems: jest.fn(),
			},
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

	it('should get all lists', async () => {
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'lists';
			if (param === 'operation') return 'getLists';
			return undefined;
		});
		const mockResponse = { id: '1', title: 'My List' };
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({ method: 'GET', uri: expect.stringContaining('/api/v1/lists') }),
		);
		expect(result?.[0]?.[0].json).toEqual(mockResponse);
	});

	it('should create and delete a list', async () => {
		// create
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'lists';
			if (param === 'operation') return 'createList';
			if (param === 'title') return 'New';
			return undefined;
		});
		const createMockResponse = { id: '2', title: 'New' };
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(createMockResponse);
		let result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({ method: 'POST', uri: expect.stringContaining('/api/v1/lists') }),
		);
		expect(result?.[0]?.[0].json).toEqual(createMockResponse);
		// delete
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'lists';
			if (param === 'operation') return 'deleteList';
			if (param === 'listId') return '2';
			return undefined;
		});
		const deleteMockResponse = {};
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(deleteMockResponse);
		result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'DELETE',
				uri: expect.stringContaining('/api/v1/lists/2'),
			}),
		);
		expect(result?.[0]?.[0].json).toEqual(deleteMockResponse);
	});
});
