import { IExecuteFunctions, INode } from 'n8n-workflow';
import { Mastodon } from '../nodes/Mastodon/Mastodon.node';

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
				createBinarySignedUrl: jest.fn(),
			} as unknown as IExecuteFunctions['helpers'],
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
				}) as unknown as INode,
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

	it('should get a list', async () => {
		const mockResponse = { id: 'list1', title: 'Test List' };
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'lists';
			if (param === 'operation') return 'getList';
			if (param === 'listId') return 'list1';
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'GET',
				uri: expect.stringContaining('/api/v1/lists/list1'),
			}),
		);
		expect(result?.[0]?.[0].json).toEqual(mockResponse);
	});

	it('should update a list', async () => {
		const mockResponse = { id: 'list2', title: 'Updated' };
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
			if (param === 'resource') return 'lists';
			if (param === 'operation') return 'updateList';
			if (param === 'listId') return 'list2';
			if (param === 'title') return 'Updated';
			if (param === 'replies_policy') return defaultValue;
			if (param === 'exclusive') return defaultValue;
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'PUT',
				uri: expect.stringContaining('/api/v1/lists/list2'),
			}),
		);
		expect(result?.[0]?.[0].json).toEqual(mockResponse);
	});

	it('should get accounts in a list', async () => {
		const mockResponse = [{ id: 'a1' }, { id: 'a2' }];
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
			if (param === 'resource') return 'lists';
			if (param === 'operation') return 'getAccountsInList';
			if (param === 'listId') return 'list3';
			if (param === 'max_id') return defaultValue;
			if (param === 'since_id') return defaultValue;
			if (param === 'min_id') return defaultValue;
			if (param === 'limit') return defaultValue;
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'GET',
				uri: expect.stringContaining('/api/v1/lists/list3/accounts'),
			}),
		);
		expect(result?.[0]?.[0].json).toEqual(mockResponse[0]);
		expect(result?.[0]?.[1].json).toEqual(mockResponse[1]);
	});

	it('should add accounts to a list', async () => {
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'lists';
			if (param === 'operation') return 'addAccountsToList';
			if (param === 'listId') return 'list4';
			if (param === 'accountIds') return ['a1', 'a2'];
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue({});

		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'POST',
				uri: expect.stringContaining('/api/v1/lists/list4/accounts'),
				body: expect.objectContaining({
					account_ids: ['a1', 'a2'],
				}),
			}),
		);
		expect(result?.[0]?.[0].json).toEqual({});
	});

	it('should remove accounts from a list', async () => {
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'lists';
			if (param === 'operation') return 'removeAccountsFromList';
			if (param === 'listId') return 'list5';
			if (param === 'accountIds') return ['a1', 'a2'];
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue({});

		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'DELETE',
				uri: expect.stringContaining('/api/v1/lists/list5/accounts'),
				body: expect.objectContaining({
					account_ids: ['a1', 'a2'],
				}),
			}),
		);
		expect(result?.[0]?.[0].json).toEqual({});
	});
});
