import { Mastodon } from '../nodes/Mastodon/Mastodon.node';
import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';

describe('Mastodon Node - Account', () => {
	let node: Mastodon;
	let ctx: Partial<IExecuteFunctions>;

	beforeEach(() => {
		node = new Mastodon();
		ctx = {
			getNodeParameter: jest.fn(),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
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

	it('should follow an account', async () => {
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'account';
			if (param === 'operation') return 'follow';
			if (param === 'accountId') return '42';
			return undefined;
		});
		const mockResponse = { id: '42', following: true };
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockResponse);

		const result = await node.execute.call(ctx as IExecuteFunctions);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'POST',
				uri: expect.stringContaining('/api/v1/accounts/42/follow'),
			}),
		);
		expect(result?.[0]?.[0].json).toEqual(mockResponse);
	});

	it('should throw if accountId is missing for unfollow', async () => {
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'account';
			if (param === 'operation') return 'unfollow';
			return undefined;
		});
		try {
			await node.execute.call(ctx as IExecuteFunctions);
			expect(true).toBe(false);
		} catch (error) {
			expect(error).toBeInstanceOf(Error);
		}
	});
});
