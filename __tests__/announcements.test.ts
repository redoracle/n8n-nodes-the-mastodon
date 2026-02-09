import { IExecuteFunctions } from 'n8n-workflow';
import { Mastodon } from '../nodes/Mastodon/Mastodon.node';

describe('Mastodon Node - Announcements', () => {
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

	it('should list announcements', async () => {
		const mockAnnouncements = [{ id: 'a1', content: '<p>Test</p>' }];
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'announcements';
			if (param === 'operation') return 'list';
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockAnnouncements);

		const result = await node.execute.call(ctx as IExecuteFunctions);

		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'GET',
				uri: expect.stringContaining('/api/v1/announcements'),
			}),
		);
		expect(result[0][0].json).toEqual(mockAnnouncements[0]);
	});
});
