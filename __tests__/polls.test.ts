import { IExecuteFunctions } from 'n8n-workflow';
import { Mastodon } from '../nodes/Mastodon/Mastodon.node';

describe('Mastodon Node - Polls', () => {
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

	describe('view', () => {
		it('should view a poll', async () => {
			const mockPoll = {
				id: 'poll123',
				expires_at: '2026-02-10T10:00:00.000Z',
				expired: false,
				multiple: false,
				votes_count: 42,
				voters_count: 42,
				options: [
					{ title: 'Option A', votes_count: 20 },
					{ title: 'Option B', votes_count: 15 },
					{ title: 'Option C', votes_count: 7 },
				],
				emojis: [],
				voted: false,
			};

			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'polls';
				if (param === 'operation') return 'view';
				if (param === 'pollId') return 'poll123';
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockPoll);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					method: 'GET',
					uri: expect.stringContaining('/api/v1/polls/poll123'),
				}),
			);
			expect(result[0][0].json).toEqual(mockPoll);
			expect(result[0][0].json.options).toHaveLength(3);
		});

		it('should handle expired poll', async () => {
			const mockExpiredPoll = {
				id: 'poll456',
				expires_at: '2026-02-08T10:00:00.000Z',
				expired: true,
				multiple: false,
				votes_count: 100,
				voters_count: 100,
				options: [
					{ title: 'Yes', votes_count: 60 },
					{ title: 'No', votes_count: 40 },
				],
				emojis: [],
				voted: true,
				own_votes: [0],
			};

			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'polls';
				if (param === 'operation') return 'view';
				if (param === 'pollId') return 'poll456';
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockExpiredPoll);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(result[0][0].json.expired).toBe(true);
			expect(result[0][0].json.voted).toBe(true);
		});

		it('should handle errors when viewing a poll', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'polls';
				if (param === 'operation') return 'view';
				if (param === 'pollId') return 'missing-poll';
				return undefined;
			});
			const httpError = Object.assign(new Error('Poll not found'), {
				statusCode: 404,
				code: 'NOT_FOUND',
			});
			(ctx.helpers!.requestOAuth2 as jest.Mock).mockRejectedValue(httpError);
			ctx.continueOnFail = jest.fn().mockReturnValue(false);

			await expect(node.execute.call(ctx as IExecuteFunctions)).rejects.toThrow(
				'The requested missing-poll was not found. Please verify the ID or handle is correct.',
			);
		});
	});

	describe('vote', () => {
		it('should vote on a poll with single choice', async () => {
			const mockPollAfterVote = {
				id: 'poll123',
				expires_at: '2026-02-10T10:00:00.000Z',
				expired: false,
				multiple: false,
				votes_count: 43,
				voters_count: 43,
				options: [
					{ title: 'Option A', votes_count: 21 },
					{ title: 'Option B', votes_count: 15 },
					{ title: 'Option C', votes_count: 7 },
				],
				emojis: [],
				voted: true,
				own_votes: [0],
			};

			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'polls';
				if (param === 'operation') return 'vote';
				if (param === 'pollId') return 'poll123';
				if (param === 'choices') return [0];
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockPollAfterVote);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					method: 'POST',
					uri: expect.stringContaining('/api/v1/polls/poll123/votes'),
					body: expect.objectContaining({ choices: [0] }),
				}),
			);
			expect(result[0][0].json.voted).toBe(true);
			expect(result[0][0].json.own_votes).toEqual([0]);
		});

		it('should vote on a poll with multiple choices', async () => {
			const mockMultiPoll = {
				id: 'poll789',
				expires_at: '2026-02-10T10:00:00.000Z',
				expired: false,
				multiple: true,
				votes_count: 50,
				voters_count: 25,
				options: [
					{ title: 'Red', votes_count: 15 },
					{ title: 'Blue', votes_count: 20 },
					{ title: 'Green', votes_count: 15 },
				],
				emojis: [],
				voted: true,
				own_votes: [0, 2],
			};

			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'polls';
				if (param === 'operation') return 'vote';
				if (param === 'pollId') return 'poll789';
				if (param === 'choices') return [0, 2];
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockMultiPoll);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					body: expect.objectContaining({ choices: [0, 2] }),
				}),
			);
			expect(result[0][0].json.own_votes).toEqual([0, 2]);
			expect(result[0][0].json.multiple).toBe(true);
		});

		it('should handle voting on an expired poll', async () => {
			const mockExpiredPoll = {
				id: 'poll999',
				expires_at: '2026-02-08T10:00:00.000Z',
				expired: true,
				multiple: false,
				votes_count: 10,
				voters_count: 10,
				options: [{ title: 'Option A', votes_count: 10 }],
				emojis: [],
				voted: false,
			};

			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'polls';
				if (param === 'operation') return 'vote';
				if (param === 'pollId') return 'poll999';
				if (param === 'choices') return [0];
				return undefined;
			});

			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockExpiredPoll);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					method: 'POST',
					uri: expect.stringContaining('/api/v1/polls/poll999/votes'),
					body: expect.objectContaining({ choices: [0] }),
				}),
			);
			expect(result[0][0].json.expired).toBe(true);
		});

		it('should propagate errors when voting fails', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'polls';
				if (param === 'operation') return 'vote';
				if (param === 'pollId') return 'pollError';
				if (param === 'choices') return [1];
				return undefined;
			});
			const apiError = Object.assign(new Error('Vote failed'), {
				statusCode: 500,
				code: 'INTERNAL_SERVER_ERROR',
			});
			(ctx.helpers!.requestOAuth2 as jest.Mock).mockRejectedValue(apiError);

			await expect(node.execute.call(ctx as IExecuteFunctions)).rejects.toThrow(
				'Mastodon API error (500): Vote failed',
			);
			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					method: 'POST',
					uri: expect.stringContaining('/api/v1/polls/pollError/votes'),
					body: expect.objectContaining({ choices: [1] }),
				}),
			);
		});
	});
});
