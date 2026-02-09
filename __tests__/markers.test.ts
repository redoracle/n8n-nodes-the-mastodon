import { IExecuteFunctions } from 'n8n-workflow';
import { Mastodon } from '../nodes/Mastodon/Mastodon.node';

describe('Mastodon Node - Markers', () => {
	let node: Mastodon;
	let ctx: Partial<IExecuteFunctions>;

	beforeEach(() => {
		node = new Mastodon();
		// This test relies on these IExecuteFunctions members: getNodeParameter, getInputData,
		// helpers.requestOAuth2, getCredentials, continueOnFail, getNode.
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

	it('should get markers', async () => {
		const mockMarkers = { home: { last_read_id: '10' } };
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
			if (param === 'resource') return 'markers';
			if (param === 'operation') return 'getMarkers';
			if (param === 'timeline') return ['home'];
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockMarkers);

		const result = await node.execute.call(ctx as IExecuteFunctions);

		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'GET',
				uri: expect.stringContaining('/api/v1/markers'),
				qs: expect.objectContaining({
					timeline: ['home'],
				}),
			}),
		);
		expect(result[0][0].json).toEqual(mockMarkers);
	});

	it('should save markers', async () => {
		const mockMarkers = { home: { last_read_id: '20' } };
		(ctx.getNodeParameter as jest.Mock).mockImplementation((param, _index, defaultValue) => {
			if (param === 'resource') return 'markers';
			if (param === 'operation') return 'saveMarkers';
			if (param === 'homeLastReadId') return '20';
			if (param === 'notificationsLastReadId') return defaultValue;
			return undefined;
		});
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockMarkers);

		const result = await node.execute.call(ctx as IExecuteFunctions);

		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
			'mastodonOAuth2Api',
			expect.objectContaining({
				method: 'POST',
				uri: expect.stringContaining('/api/v1/markers'),
				body: expect.objectContaining({
					'home[last_read_id]': '20',
				}),
			}),
		);
		expect(result[0][0].json).toEqual(mockMarkers);
	});
});
