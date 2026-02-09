import { IExecuteFunctions } from 'n8n-workflow';
import { Mastodon } from '../nodes/Mastodon/Mastodon.node';

describe('Mastodon Node - Endorsements', () => {
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

	describe('get', () => {
		it('should get endorsed accounts with default parameters', async () => {
			const mockEndorsements = [
				{
					id: 'account1',
					username: 'alice',
					acct: 'alice@mastodon.social',
					display_name: 'Alice Smith',
					note: 'Developer and writer',
					followers_count: 500,
				},
				{
					id: 'account2',
					username: 'bob',
					acct: 'bob@another.social',
					display_name: 'Bob Jones',
					note: 'Designer',
					followers_count: 350,
				},
			];

			(ctx.getNodeParameter as jest.Mock).mockImplementation((param, index, defaultValue) => {
				if (param === 'resource') return 'endorsements';
				if (param === 'operation') return 'get';
				if (param === 'authType') return 'oAuth2';
				if (param === 'url') return 'https://mastodon.social';
				if (param === 'additionalFields') return defaultValue || {};
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockEndorsements);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					method: 'GET',
					uri: expect.stringContaining('/api/v1/endorsements'),
				}),
			);
			expect(result[0]).toHaveLength(2);
			expect(result[0][0].json).toEqual(mockEndorsements[0]);
		});

		it('should get endorsed accounts with limit', async () => {
			const mockEndorsements = [
				{ id: 'account1', username: 'alice' },
				{ id: 'account2', username: 'bob' },
				{ id: 'account3', username: 'charlie' },
			];

			(ctx.getNodeParameter as jest.Mock).mockImplementation((param, index, defaultValue) => {
				if (param === 'resource') return 'endorsements';
				if (param === 'operation') return 'get';
				if (param === 'authType') return 'oAuth2';
				if (param === 'url') return 'https://mastodon.social';
				if (param === 'additionalFields') return { limit: 10 };
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockEndorsements);

			await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					qs: expect.objectContaining({
						limit: 10,
					}),
				}),
			);
		});

		it('should get endorsed accounts with pagination parameters', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param, index, defaultValue) => {
				if (param === 'resource') return 'endorsements';
				if (param === 'operation') return 'get';
				if (param === 'authType') return 'oAuth2';
				if (param === 'url') return 'https://mastodon.social';
				if (param === 'additionalFields')
					return {
						max_id: 'account999',
						since_id: 'account100',
						limit: 20,
					};
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue([]);

			await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					qs: expect.objectContaining({
						max_id: 'account999',
						since_id: 'account100',
						limit: 20,
					}),
				}),
			);
		});
	});

	describe('get - pagination parameters', () => {
		let freshNode: Mastodon;
		let freshCtx: Partial<IExecuteFunctions>;

		beforeEach(() => {
			freshNode = new Mastodon();
			freshCtx = {
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

		it('should get endorsed accounts with max_id only', async () => {
			const mockEndorsements = [{ id: 'account500', username: 'dave' }];

			(freshCtx.getNodeParameter as jest.Mock).mockImplementation((param, index, defaultValue) => {
				if (param === 'resource') return 'endorsements';
				if (param === 'operation') return 'get';
				if (param === 'authType') return 'oAuth2';
				if (param === 'url') return 'https://mastodon.social';
				if (param === 'additionalFields') return { max_id: 'account600' };
				return undefined;
			});

			(freshCtx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockEndorsements);

			await freshNode.execute.call(freshCtx as IExecuteFunctions);

			expect(freshCtx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					qs: expect.objectContaining({
						max_id: 'account600',
					}),
				}),
			);
		});

		it('should get endorsed accounts with since_id only', async () => {
			const mockEndorsements = [
				{ id: 'account700', username: 'eve' },
				{ id: 'account800', username: 'frank' },
			];

			(freshCtx.getNodeParameter as jest.Mock).mockImplementation((param, index, defaultValue) => {
				if (param === 'resource') return 'endorsements';
				if (param === 'operation') return 'get';
				if (param === 'authType') return 'oAuth2';
				if (param === 'url') return 'https://mastodon.social';
				if (param === 'additionalFields') return { since_id: 'account600' };
				return undefined;
			});

			(freshCtx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockEndorsements);

			await freshNode.execute.call(freshCtx as IExecuteFunctions);

			expect(freshCtx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					qs: expect.objectContaining({
						since_id: 'account600',
					}),
				}),
			);
		});
	});
});
