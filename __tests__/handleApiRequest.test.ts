import { handleApiRequest, RequestQueue, ResponseCache } from '../nodes/Mastodon/Mastodon_Methods';
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

	afterEach(() => {
		ResponseCache.getInstance().clear();
		RequestQueue.getInstance().destroy();
		jest.useRealTimers();
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
}
	it('isolates GET cache results between different access tokens', async () => {
		const request = ctx.helpers!.requestOAuth2 as jest.Mock;
		request.mockResolvedValueOnce({ body: { account: 'A' }, headers: {} })
			.mockResolvedValueOnce({ body: { account: 'B' }, headers: {} });
		expect(await handleApiRequest.call(ctx as IExecuteFunctions, 'GET', '/api/v1/accounts/verify_credentials')).toEqual({ account: 'A' });
		(ctx.getCredentials as jest.Mock).mockResolvedValue({
			baseUrl: 'https://mastodon.social',
			oauth2: { accessToken: 'another-token' },
		});
		expect(await handleApiRequest.call(ctx as IExecuteFunctions, 'GET', '/api/v1/accounts/verify_credentials')).toEqual({ account: 'B' });
		expect(await handleApiRequest.call(ctx as IExecuteFunctions, 'GET', '/api/v1/accounts/verify_credentials')).toEqual({ account: 'B' });
		expect(request).toHaveBeenCalledTimes(2);
	});

	it('never automatically retries a failed POST', async () => {
		const request = ctx.helpers!.requestOAuth2 as jest.Mock;
		request.mockRejectedValue({ statusCode: 503, message: 'Service Unavailable' });
		await expect(handleApiRequest.call(ctx as IExecuteFunctions, 'POST', '/api/v1/statuses', {
			status: 'hello',
		})).rejects.toBeInstanceOf(NodeOperationError);
		expect(request).toHaveBeenCalledTimes(1);
	});

	it('retries GET after freeing its queue slot', async () => {
		jest.useFakeTimers();
		const request = ctx.helpers!.requestOAuth2 as jest.Mock;
		request.mockRejectedValueOnce({ statusCode: 503, message: 'Service Unavailable' })
			.mockResolvedValueOnce({ body: { recovered: true }, headers: {} });
		const pending = handleApiRequest.call(ctx as IExecuteFunctions, 'GET', '/api/v1/retry-test');
		await jest.advanceTimersByTimeAsync(3500);
		await expect(pending).resolves.toEqual({ recovered: true });
		expect(request).toHaveBeenCalledTimes(2);
	});
});
