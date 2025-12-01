import { handleApiRequest } from '../nodes/Mastodon/Mastodon_Methods';
import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';

describe('handleApiRequest helper', () => {
	let ctx: Partial<IExecuteFunctions>;

	beforeEach(() => {
		ctx = {
			getCredentials: jest.fn().mockResolvedValue({
				baseUrl: 'https://mastodon.social',
				oauth2: { accessToken: 'test-token' },
			}),
			getNode: jest.fn().mockReturnValue({} as unknown as ReturnType<IExecuteFunctions['getNode']>),
			helpers: { requestOAuth2: jest.fn() } as unknown as IExecuteFunctions['helpers'],
		};
	});

	it('returns the response body on success', async () => {
		const mockBody = { data: 'ok' };
		// Simulate full response with body
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue({ body: mockBody, headers: {} });

		const result = await handleApiRequest.call(ctx as IExecuteFunctions, 'GET', '/api/v1/test');
		expect(result).toEqual(mockBody);
		expect(ctx.helpers!.requestOAuth2).toHaveBeenCalled();
	});

	it('throws a NodeOperationError on API error', async () => {
		const apiError = {
			statusCode: 500,
			message: 'Internal Server Error',
			name: 'Error',
			response: { body: { error: 'fail' }, headers: {} },
		} as unknown as Error;

		(ctx.helpers!.requestOAuth2 as jest.Mock).mockRejectedValue(apiError);

		await expect(
			handleApiRequest.call(ctx as IExecuteFunctions, 'GET', '/api/v1/error'),
		).rejects.toBeInstanceOf(NodeOperationError);
	});
});
