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

	it('rejects cross-origin endpoints before transmitting a bearer token', async () => {
		await expect(handleApiRequest.call(ctx as IExecuteFunctions, 'GET', 'https://example.org/api/v1/accounts')).rejects.toBeInstanceOf(NodeOperationError);
		expect(ctx.helpers!.requestOAuth2).not.toHaveBeenCalled();
	});

	it('rejects URL and redirect overrides before issuing a request', async () => {
		await expect(handleApiRequest.call(ctx as IExecuteFunctions, 'GET', '/api/v1/accounts', {}, {}, {
			uri: 'https://example.org/exfiltrate',
		})).rejects.toBeInstanceOf(NodeOperationError);
		expect(ctx.helpers!.requestOAuth2).not.toHaveBeenCalled();
	});

	it('merges custom headers with credentials and disables redirects', async () => {
		const request = ctx.helpers!.requestOAuth2 as jest.Mock;
		request.mockResolvedValue({ body: { id: '1' }, headers: {} });
		await handleApiRequest.call(ctx as IExecuteFunctions, 'POST', '/api/v1/statuses', {
			status: 'hello',
		}, {}, { headers: { 'Idempotency-Key': 'unique-key' } });
		const sent = request.mock.calls[0][1];
		expect(sent.headers.Authorization).toBe('Bearer test-token');
		expect(sent.headers['Idempotency-Key']).toBe('unique-key');
		expect(sent.followRedirect).toBe(false);
		expect(sent.followAllRedirects).toBe(false);
	});

	it('does not cache responses when a different bearer header is provided', async () => {
		const request = ctx.helpers!.requestOAuth2 as jest.Mock;
		request.mockResolvedValueOnce({ body: { account: 'first' }, headers: {} })
			.mockResolvedValueOnce({ body: { account: 'second' }, headers: {} });
		const options = { headers: { Authorization: 'Bearer an-exchanged-token' } };
		expect(await handleApiRequest.call(ctx as IExecuteFunctions, 'GET', '/api/v1/accounts/verify_credentials', {}, {}, options)).toEqual({ account: 'first' });
		expect(await handleApiRequest.call(ctx as IExecuteFunctions, 'GET', '/api/v1/accounts/verify_credentials', {}, {}, options)).toEqual({ account: 'second' });
		expect(request).toHaveBeenCalledTimes(2);
	});

	it('parses ISO-8601 rate-limit resets instead of treating years as Unix timestamps', async () => {
		const timestamp = new Date(Date.now() + 300000).toISOString();
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue({
			body: { ok: true },
			headers: { 'x-ratelimit-limit': '300', 'x-ratelimit-remaining': '17', 'x-ratelimit-reset': timestamp },
		});
		await handleApiRequest.call(ctx as IExecuteFunctions, 'GET', '/api/v1/instance');
		const state = RequestQueue.getInstance().getStatus();
		expect(state.rateLimitRemaining).toBe(17);
		expect(state.rateLimitReset).toBe(Math.floor(Date.parse(timestamp) / 1000) * 1000);
	});

	it('does not overwrite known rate limits when response headers are absent', async () => {
		const queue = RequestQueue.getInstance();
		queue.updateRateLimits(8, Math.floor(Date.now() / 1000) + 300);
		(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue({ body: { ok: true }, headers: {} });
		await handleApiRequest.call(ctx as IExecuteFunctions, 'GET', '/api/v1/instance');
		expect(queue.getStatus().rateLimitRemaining).toBe(7);
	});
});
