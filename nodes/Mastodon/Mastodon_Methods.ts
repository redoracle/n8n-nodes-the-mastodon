// Core helper methods for Mastodon API interactions
import {
	IBinaryKeyData,
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	INodeExecutionData,
	IRequestOptions,
	LoggerProxy as Logger,
	NodeOperationError
} from 'n8n-workflow';

// Local sleep helper (avoid relying on n8n-workflow export that may not exist in all versions)
const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

// Custom error classes for better error handling
class MastodonApiError extends Error {
	constructor(
		message: string,
		public statusCode: number,
		public response?: unknown,
	) {
		super(message);
		this.name = 'MastodonApiError';
	}
}

class MastodonRateLimitError extends MastodonApiError {
	constructor(retryAfter: number) {
		super(`Rate limit exceeded. Retry after ${retryAfter} seconds`, 429);
		this.name = 'MastodonRateLimitError';
	}
}

// Enhanced logging utilities
class MastodonLogger {
	private static instance: MastodonLogger;
	private debugMode = false;

	private constructor() {}

	static getInstance(): MastodonLogger {
		if (!MastodonLogger.instance) {
			MastodonLogger.instance = new MastodonLogger();
		}
		return MastodonLogger.instance;
	}

	enableDebug(enable = true): void {
		this.debugMode = enable;
	}

	private formatMessage(level: string, message: string, meta?: object): string {
		const timestamp = new Date().toISOString();
		const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
		return `[${timestamp}] [Mastodon] [${level}] ${message}${metaStr}`;
	}

	debug(message: string, meta?: object): void {
		if (this.debugMode) {
			Logger.debug(this.formatMessage('DEBUG', message, meta));
		}
	}

	info(message: string, meta?: object): void {
		Logger.info(this.formatMessage('INFO', message, meta));
	}

	warn(message: string, meta?: object): void {
		Logger.warn(this.formatMessage('WARN', message, meta));
	}

	error(message: string, error?: Error, meta?: object): void {
		const errorMeta = error
			? {
					...meta,
					errorName: error.name,
					errorMessage: error.message,
					stack: error.stack,
				}
			: meta;
		Logger.error(this.formatMessage('ERROR', message, errorMeta));
	}

	metric(name: string, value: number, meta?: object): void {
		Logger.info(this.formatMessage('METRIC', `${name}=${value}`, meta));
	}
}

// Performance monitoring
class PerformanceMonitor {
	private static instance: PerformanceMonitor;
	private metrics: Map<string, { count: number; totalTime: number; errors: number }> = new Map();
	private logger = MastodonLogger.getInstance();

	private constructor() {}

	static getInstance(): PerformanceMonitor {
		if (!PerformanceMonitor.instance) {
			PerformanceMonitor.instance = new PerformanceMonitor();
		}
		return PerformanceMonitor.instance;
	}

	async trackOperation<T>(operationName: string, operation: () => Promise<T>): Promise<T> {
		const startTime = Date.now();
		try {
			const result = await operation();
			this.recordMetric(operationName, Date.now() - startTime);
			return result;
		} catch (error) {
			this.recordError(operationName);
			throw error;
		}
	}

	private recordMetric(operationName: string, duration: number): void {
		const current = this.metrics.get(operationName) || { count: 0, totalTime: 0, errors: 0 };
		current.count++;
		current.totalTime += duration;
		this.metrics.set(operationName, current);

		this.logger.metric(operationName, duration, {
			avgTime: current.totalTime / current.count,
			totalCalls: current.count,
			errorRate: current.errors / current.count,
		});
	}

	private recordError(operationName: string): void {
		const current = this.metrics.get(operationName) || { count: 0, totalTime: 0, errors: 0 };
		current.errors++;
		this.metrics.set(operationName, current);
	}

	getMetrics(): { [key: string]: { avgTime: number; totalCalls: number; errorRate: number } } {
		const result: { [key: string]: { avgTime: number; totalCalls: number; errorRate: number } } =
			{};
		for (const [operation, metrics] of this.metrics.entries()) {
			result[operation] = {
				avgTime: metrics.totalTime / metrics.count,
				totalCalls: metrics.count,
				errorRate: metrics.errors / metrics.count,
			};
		}
		return result;
	}
}

// Rate limiting and request queue
export class RequestQueue {
	private static instance: RequestQueue;
	private queue: Array<{
		request: () => Promise<unknown>;
		resolve: (value: unknown) => void;
		reject: (error: unknown) => void;
		timestamp: number;
	}> = [];
	private processing = false;
	private rateLimitRemaining = 300; // Default rate limit
	private rateLimitReset = Date.now();
	private requestsMadeThisWindow = 0;
	private readonly MAX_QUEUE_SIZE = 1000; // Prevent memory leaks
	private readonly REQUEST_TIMEOUT = 60000; // 60 seconds timeout for queued requests
	private cleanupIntervalId: NodeJS.Timeout | null = null;

	private constructor() {
		// Clean up old queued requests periodically
		this.cleanupIntervalId = setInterval(() => this.cleanupExpiredRequests(), 30000);
	}

	static getInstance(): RequestQueue {
		if (!RequestQueue.instance) {
			RequestQueue.instance = new RequestQueue();
		}
		return RequestQueue.instance;
	}

	updateRateLimits(remaining: number, resetTime: number): void {
		this.rateLimitRemaining = remaining;
		this.rateLimitReset = resetTime * 1000;

		// Reset the requests counter when we get fresh rate limit info
		if (resetTime * 1000 > Date.now()) {
			this.requestsMadeThisWindow = Math.max(0, 300 - remaining);
		}

		// Resume processing if we have remaining requests
		if (remaining > 0 && !this.processing) {
			this.processQueue();
		}
	}

	async add<T>(request: () => Promise<T>): Promise<T> {
		// Check if queue is full to prevent memory leaks
		if (this.queue.length >= this.MAX_QUEUE_SIZE) {
			throw new Error('Request queue is full. Too many pending requests.');
		}

		return new Promise<T>((resolve, reject) => {
			// Store callbacks and request as unknown-based to avoid using `any` while preserving generic behavior.
			const queueItem = {
				request: request as () => Promise<unknown>,
				resolve: (value: unknown) => {
					// Cast back to the expected generic type when resolving.
					resolve(value as T);
				},
				reject: (error: unknown) => {
					// Forward the rejection (cast for compatibility).
					reject(error as Error);
				},
				timestamp: Date.now(),
			};

			this.queue.push(queueItem);

			// Start processing if not already running
			if (!this.processing) {
				this.processQueue();
			}
		});
	}

	private cleanupExpiredRequests(): void {
		const now = Date.now();
		const expiredRequests = this.queue.filter(
			(item) => now - item.timestamp > this.REQUEST_TIMEOUT,
		);

		// Reject expired requests
		expiredRequests.forEach((item) => {
			item.reject(new Error('Request timeout: queued too long'));
		});

		// Remove expired requests from queue
		this.queue = this.queue.filter((item) => now - item.timestamp <= this.REQUEST_TIMEOUT);
	}

	private async processQueue(): Promise<void> {
		if (this.processing) return;
		this.processing = true;

		try {
			while (this.queue.length > 0) {
				// Check if we need to wait for rate limit reset
				const now = Date.now();
				if (this.rateLimitRemaining <= 0 && now < this.rateLimitReset) {
					const delay = this.rateLimitReset - now;
					Logger.debug(`[Mastodon] Queue waiting for rate limit reset: ${delay}ms`);
					await new Promise((resolve) => setTimeout(resolve, delay));

					// After waiting, reset our tracking
					this.rateLimitRemaining = 300;
					this.requestsMadeThisWindow = 0;
				}

				// Process next request in queue
				const queueItem = this.queue.shift();
				if (!queueItem) break;

				// Check if request has expired
				if (Date.now() - queueItem.timestamp > this.REQUEST_TIMEOUT) {
					queueItem.reject(new Error('Request timeout: queued too long'));
					continue;
				}

				try {
					// Decrement rate limit counter before making request
					if (this.rateLimitRemaining > 0) {
						this.rateLimitRemaining--;
						this.requestsMadeThisWindow++;
					}

					const result = await queueItem.request();
					queueItem.resolve(result);
				} catch (error) {
					queueItem.reject(error);
				}

				// Add delay between requests to be respectful
				await new Promise((resolve) => setTimeout(resolve, 100));
			}
		} catch (error) {
			Logger.error('Error in queue processing', error);
		} finally {
			this.processing = false;

			// If there are still items in queue, schedule another processing cycle
			if (this.queue.length > 0) {
				setTimeout(() => this.processQueue(), 1000);
			}
		}
	}

	// Add method to cleanup and destroy the queue instance (useful for tests)
	destroy(): void {
		if (this.cleanupIntervalId) {
			clearInterval(this.cleanupIntervalId);
			this.cleanupIntervalId = null;
		}
		this.queue.length = 0; // Clear the queue
		this.processing = false;
		RequestQueue.instance = undefined as unknown as RequestQueue; // Reset singleton
	}

	// Add method to get queue status for debugging
	getStatus(): {
		queueLength: number;
		rateLimitRemaining: number;
		rateLimitReset: number;
		processing: boolean;
		requestsMade: number;
	} {
		return {
			queueLength: this.queue.length,
			rateLimitRemaining: this.rateLimitRemaining,
			rateLimitReset: this.rateLimitReset,
			processing: this.processing,
			requestsMade: this.requestsMadeThisWindow,
		};
	}
}

// Cache implementation
// Rate limit handler for managing API limits
class RateLimitHandler {
	static handleRateLimit(limit: number, remaining: number, reset: number): void {
		const queue = RequestQueue.getInstance();
		queue.updateRateLimits(remaining, reset);
	}
}

class ResponseCache {
	private static instance: ResponseCache;
	private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
	private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes default TTL

	private constructor() {}

	static getInstance(): ResponseCache {
		if (!ResponseCache.instance) {
			ResponseCache.instance = new ResponseCache();
		}
		return ResponseCache.instance;
	}

	private generateCacheKey(method: string, endpoint: string, params: string): string {
		return `${method}:${endpoint}:${params}`;
	}

	get(method: string, endpoint: string, params: string): unknown | null {
		const key = this.generateCacheKey(method, endpoint, params);
		const cached = this.cache.get(key);

		if (!cached) {
			return null;
		}

		// Check if cache entry has expired
		if (Date.now() - cached.timestamp > this.DEFAULT_TTL) {
			this.cache.delete(key);
			return null;
		}

		return cached.data;
	}

	set(method: string, endpoint: string, params: string, data: unknown): void {
		const key = this.generateCacheKey(method, endpoint, params);
		this.cache.set(key, {
			data,
			timestamp: Date.now(),
		});
	}

	invalidate(method: string, endpoint: string, params: string): void {
		const key = this.generateCacheKey(method, endpoint, params);
		this.cache.delete(key);
	}

	invalidatePattern(pattern: string): void {
		for (const key of this.cache.keys()) {
			if (key.includes(pattern)) {
				this.cache.delete(key);
			}
		}
	}
}

// Test mode configuration
class TestMode {
	private static instance: TestMode;
	private enabled = false;
	private mockResponses: Map<string, unknown> = new Map();
	private logger = MastodonLogger.getInstance();

	private constructor() {}

	static getInstance(): TestMode {
		if (!TestMode.instance) {
			TestMode.instance = new TestMode();
		}
		return TestMode.instance;
	}

	enable(): void {
		this.enabled = true;
		this.logger.info('Test mode enabled');
	}

	disable(): void {
		this.enabled = false;
		this.logger.info('Test mode disabled');
	}

	isEnabled(): boolean {
		return this.enabled;
	}

	setMockResponse(key: string, response: unknown): void {
		this.mockResponses.set(key, response);
	}

	getMockResponse(method: string, endpoint: string): unknown {
		const key = `${method}:${endpoint}`;
		return this.mockResponses.get(key);
	}

	clearMockResponses(): void {
		this.mockResponses.clear();
	}
}

// API Metrics tracking
class ApiMetrics {
	private static instance: ApiMetrics;
	private metrics: {
		requests: { [key: string]: number };
		errors: { [key: string]: number };
		rateLimits: { [key: string]: number };
		timing: { [key: string]: number[] };
	} = {
		requests: {},
		errors: {},
		rateLimits: {},
		timing: {},
	};

	private constructor() {}

	static getInstance(): ApiMetrics {
		if (!ApiMetrics.instance) {
			ApiMetrics.instance = new ApiMetrics();
		}
		return ApiMetrics.instance;
	}

	trackRequest(endpoint: string, duration: number): void {
		this.metrics.requests[endpoint] = (this.metrics.requests[endpoint] || 0) + 1;
		if (!this.metrics.timing[endpoint]) {
			this.metrics.timing[endpoint] = [];
		}
		this.metrics.timing[endpoint].push(duration);
	}

	trackError(endpoint: string, statusCode: number): void {
		const key = `${endpoint}:${statusCode}`;
		this.metrics.errors[key] = (this.metrics.errors[key] || 0) + 1;
	}

	trackRateLimit(endpoint: string): void {
		this.metrics.rateLimits[endpoint] = (this.metrics.rateLimits[endpoint] || 0) + 1;
	}

	getMetrics(): object {
		const averageTimings: { [key: string]: number } = {};
		for (const [endpoint, timings] of Object.entries(this.metrics.timing)) {
			averageTimings[endpoint] = timings.reduce((a, b) => a + b, 0) / timings.length;
		}

		return {
			totalRequests: Object.values(this.metrics.requests).reduce((a, b) => a + b, 0),
			requestsByEndpoint: this.metrics.requests,
			totalErrors: Object.values(this.metrics.errors).reduce((a, b) => a + b, 0),
			errorsByEndpoint: this.metrics.errors,
			rateLimitHits: this.metrics.rateLimits,
			averageResponseTime: averageTimings,
		};
	}

	reset(): void {
		this.metrics = {
			requests: {},
			errors: {},
			rateLimits: {},
			timing: {},
		};
	}
}

/**
 * Core helper function for making API requests to Mastodon
 * Used by all modularized methods
 */
interface IMastodonOAuth2ApiCredentials {
	baseUrl: string;
	oauth2?: {
		accessToken: string;
	};
	oauthTokenData?: {
		access_token: string;
	};
	access_token?: string;
	accessToken?: string;
}

// Export a shared type for bound, typed calls to handleApiRequest to avoid repeating
// the inline `as unknown as` assertion across modules.
export type HandleApiRequestFn = <U = IDataObject>(
	method: string,
	endpoint: string,
	body?: IDataObject,
	qs?: IDataObject,
	options?: IDataObject,
	retryAttempt?: number,
	/** Optional runtime validator/type-guard for cached responses */
	validator?: (data: unknown) => data is U,
) => Promise<U>;

/**
 * Helper that returns a bound handleApiRequest function for the provided `this` context.
 * Use like: `const apiRequest = bindHandleApiRequest(this); await apiRequest<T>(...)`.
 */
export function bindHandleApiRequest<TThis extends IExecuteFunctions>(
	ctx: TThis,
): HandleApiRequestFn {
	// bind returns a function whose `this` is already fixed; cast to the exported
	// HandleApiRequestFn so callers get the generic typing without needing `as unknown`.
	return handleApiRequest.bind(ctx) as HandleApiRequestFn;
}

/* tslint:disable:no-any -- handleApiRequest is generic; default `any` kept for incremental migration */
export async function handleApiRequest<T = any>(
	this: IExecuteFunctions,
	method: string,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
	options: IDataObject = {},
	retryAttempt = 0,
	validator?: (data: unknown) => data is T,
): Promise<T> {
	const logger = MastodonLogger.getInstance();
	const monitor = PerformanceMonitor.getInstance();
	const cache = ResponseCache.getInstance();
	const operationName = `${method}:${endpoint.split('/').slice(-2).join('/')}`;
	const startTime = Date.now();

	// Always use the baseUrl from the OAuth2 credential
	const credentials = (await this.getCredentials(
		'mastodonOAuth2Api',
	)) as IMastodonOAuth2ApiCredentials;
	logger.debug('Mastodon credentials at runtime', credentials); // Debug log for credential structure
	if (!credentials?.baseUrl) {
		throw new NodeOperationError(
			this.getNode(),
			'No Mastodon OAuth2 credentials found or baseUrl missing. Please ensure you have selected a valid Mastodon OAuth2 credential in the node.',
		);
	}

	// Fallback: Ensure access token is available under credentials.oauth2.accessToken
	if (!credentials.oauth2?.accessToken) {
		const accessToken =
			credentials.oauthTokenData?.access_token ||
			credentials.access_token ||
			credentials.accessToken;
		if (accessToken) {
			credentials.oauth2 = { accessToken };
		}
	}

	// Verify we have an access token
	if (!credentials.oauth2?.accessToken) {
		logger.error('No valid access token found in credentials', undefined, credentials);
		throw new NodeOperationError(
			this.getNode(),
			'No valid access token found. Please reconnect your Mastodon account, ensure you have selected the correct OAuth2 credential, and that it is not expired.',
		);
	}

	let baseUrl = credentials.baseUrl;
	if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);

	const fullUrl = endpoint.startsWith('http')
		? endpoint
		: `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

	const metrics = ApiMetrics.getInstance();

	// Provide a local bound helper for internal recursion/queueing convenience
	const ha = bindHandleApiRequest(this);
	return monitor.trackOperation(operationName, async (): Promise<T> => {
		const queue = RequestQueue.getInstance();
		return queue.add(async (): Promise<T> => {
			// Only cache GET requests
			if (method === 'GET') {
				const params = JSON.stringify({ ...qs, ...options });
				const cachedResponse = cache.get(method, fullUrl, params);
				if (cachedResponse) {
					logger.debug('Cache hit', { endpoint: fullUrl });

					if (typeof validator === 'function') {
						try {
							if (validator(cachedResponse)) {
								return cachedResponse as T;
							}
							logger.warn('Cached response failed validation; invalidating cache and fetching fresh data', {
								endpoint: fullUrl,
							});
							cache.invalidate(method, fullUrl, params);
						} catch (err) {
							logger.warn('Validator threw an error while validating cached response; invalidating cache', {
								endpoint: fullUrl,
								error: err instanceof Error ? err.message : String(err),
							});
							cache.invalidate(method, fullUrl, params);
						}
					} else {
						// No validator provided: return cached response as-is
						logger.debug('Cache hit (no validator)', { endpoint: fullUrl });
						return cachedResponse as T;
					}
				}
			}

			const maxRetries = 5; // Increased from 3 to 5
			const baseDelay = 3000; // Increased from 2000 to 3000ms

			let requestOptions: IRequestOptions = {
				headers: {
					'Content-Type': 'application/json',
					'User-Agent': 'n8n-nodes-mastodon',
					Accept: 'application/json',
					Connection: 'keep-alive',
					Authorization: `Bearer ${credentials?.oauth2?.accessToken ?? ''}`,
				},
				method: method.toUpperCase() as IHttpRequestMethods,
				body,
				qs,
				uri: fullUrl,
				json: true,
				resolveWithFullResponse: true,
				timeout: 60000, // Increased from 30s to 60s
				followRedirect: true,
				followAllRedirects: true,
				maxRedirects: 5,
				forever: true,
				gzip: true, // Enable compression
				pool: { maxSockets: 100 },
			} as IRequestOptions;

			try {
				if (Object.keys(options).length !== 0) {
					requestOptions = { ...requestOptions, ...options };
				}

				// Support multipart form data uploads
				if ('formData' in options) {
					requestOptions.formData = (options as IDataObject & { formData: IDataObject }).formData;
					delete requestOptions.body;
					delete requestOptions.json;
					if (requestOptions.headers) {
						delete requestOptions.headers['Content-Type'];
					}
				}

				if (Object.keys(body).length === 0) {
					delete requestOptions.body;
				}
				if (Object.keys(qs).length === 0) {
					delete requestOptions.qs;
				}

				logger.debug('Making API request', { method, endpoint: fullUrl, retryAttempt });

				const rawResponse = await this.helpers.requestOAuth2.call(
					this,
					'mastodonOAuth2Api',
					requestOptions,
				);
				// Jest mocks may return the body directly, so fallback to rawResponse
				const responseBody: IDataObject =
					rawResponse && rawResponse.body !== undefined ? rawResponse.body : rawResponse;

				// Handle rate limits
				if (rawResponse.headers) {
					const limit = parseInt(rawResponse.headers['x-ratelimit-limit'] || '300', 10);
					const remaining = parseInt(rawResponse.headers['x-ratelimit-remaining'] || '300', 10);
					const reset = parseInt(rawResponse.headers['x-ratelimit-reset'] || '0', 10);

					RateLimitHandler.handleRateLimit(limit, remaining, reset);

					// Log rate limit status for monitoring
					if (remaining < 50) {
						logger.warn(`Rate limit running low: ${remaining}/${limit} remaining`);
					}
				}

				// Validate response before returning. Use provided validator if available,
				// otherwise perform a minimal sanity check to ensure we don't blindly cast arbitrary values.
				if (typeof validator === 'function') {
					try {
						if (!validator(responseBody)) {
							// Validation failed - do not cache and surface an error with details
							const msg = `API response validation failed for ${method} ${fullUrl}`;
							logger.error(msg, undefined, { responseBody });
							throw new NodeOperationError(this.getNode(), msg, {
								description: 'The API response did not match the expected shape. Consider updating the validator schema or handling unexpected responses.',
							});
						}
					} catch (err) {
						const msg = `Validator threw an error while validating response for ${method} ${fullUrl}`;
						logger.error(msg, err instanceof Error ? err : undefined, { responseBody });
						throw new NodeOperationError(this.getNode(), msg, {
							description: 'The provided validator threw an error while validating the API response.',
						});
					}
				} else {
					// Minimal sanity check: response should be an object or an array. This avoids casting primitives to structured types.
					const ok = responseBody !== null && (typeof responseBody === 'object');
					if (!ok) {
						const msg = `Unexpected API response type for ${method} ${fullUrl}`;
						logger.error(msg, undefined, { responseBody });
						throw new NodeOperationError(this.getNode(), msg, {
							description: 'Expected an object or array from the Mastodon API, but received a primitive value. Provide a validator if you need custom shape validation.',
						});
					}
				}

				// Cache successful GET responses (only after validation passed)
				if (method === 'GET') {
					const paramsJson = JSON.stringify({ ...qs, ...options });
					cache.set(method, fullUrl, paramsJson, responseBody);
				}

				metrics.trackRequest(operationName, Date.now() - startTime);

				// Safe to cast now: either validator guaranteed type or we performed minimal sanity check.
				return responseBody as unknown as T;
			} catch (error) {
				metrics.trackError(operationName, error.statusCode || 500);
				const errorDetails = {
					method,
					endpoint: fullUrl,
					retryAttempt,
					errorName: error.name,
					errorMessage: error.message,
					statusCode: error.statusCode,
					stack: error.stack,
					response: error.response?.body,
				};

				// Connection/Network error handling
				if (
					!error.statusCode ||
					error.code === 'ETIMEDOUT' ||
					error.code === 'ECONNREFUSED' ||
					error.code === 'ECONNRESET'
				) {
					logger.warn('Network error occurred', errorDetails);
					if (retryAttempt < maxRetries) {
						const delay = Math.min(baseDelay * Math.pow(2, retryAttempt), 30000); // Cap at 30 seconds
						logger.info(
							`Retrying request after ${delay}ms (attempt ${retryAttempt + 1}/${maxRetries})`,
						);
						await new Promise((resolve) => setTimeout(resolve, delay));
						return ha<T>(method, endpoint, body, qs, options, retryAttempt + 1, validator);
					}
					throw new NodeOperationError(
						this.getNode(),
						`Network error: Unable to connect to Mastodon server. Please check if ${baseUrl} is accessible.`,
						{
							description:
								'The server is unreachable. This could be due to temporary network issues or server maintenance.',
						},
					);
				}

				// Enhanced error handling for common status codes
				switch (error.statusCode) {
					case 401:
						throw new NodeOperationError(
							this.getNode(),
							'Authentication failed: Please reconnect your Mastodon credentials.',
						);
					case 403:
						throw new NodeOperationError(
							this.getNode(),
							'Insufficient OAuth2 scope: Please ensure your Mastodon app and credentials have all required permissions for this operation.',
						);
					case 404:
						const resourceType = endpoint.split('/').pop()?.replace(/s$/, '') || 'resource';
						throw new NodeOperationError(
							this.getNode(),
							`The requested ${resourceType} was not found. Please verify the ID or handle is correct.`,
							{ itemIndex: 0 },
						);
					case 429:
						const retryAfter = parseInt(error.response?.headers?.['retry-after'] || '60', 10);
						metrics.trackRateLimit(operationName);

						// Update queue with rate limit info
						const queue = RequestQueue.getInstance();
						queue.updateRateLimits(0, Math.floor(Date.now() / 1000) + retryAfter);

					// If this is not a retry, queue the request instead of failing immediately
					if (retryAttempt === 0) {
						logger.info(`Rate limit hit, queuing request for retry after ${retryAfter}s`);
						return queue.add(() => ha<T>(method, endpoint, body, qs, options, 1, validator));
					}						throw new MastodonRateLimitError(retryAfter);
					case 502:
					case 503:
					case 504:
						logger.warn(`Received ${error.statusCode} error, retrying request`, errorDetails);
						if (retryAttempt < maxRetries) {
							const delay = Math.min(baseDelay * Math.pow(2, retryAttempt), 30000);
							logger.info(
								`Retrying request after ${delay}ms (attempt ${retryAttempt + 1}/${maxRetries})`,
							);
							await new Promise((resolve) => setTimeout(resolve, delay));
							return ha<T>(method, endpoint, body, qs, options, retryAttempt + 1, validator);
						}
						throw new NodeOperationError(
							this.getNode(),
							`Mastodon API is temporarily unavailable (${error.statusCode}). Please try again later.`,
							{
								description:
									'The server is experiencing high load or maintenance. This is usually temporary.',
							},
						);
					default:
						throw new NodeOperationError(
							this.getNode(),
							`Mastodon API error (${error.statusCode || 'unknown'}): ${error.message}`,
							{
								description:
									error.description ||
									'An unexpected error occurred while communicating with the Mastodon API.',
							},
						);
				}
			}
		});
	});
}

/* tslint:enable:no-any */

/**
 * Helper function for uploading attachments
 * Used by media and status modules
 */
export async function uploadAttachments(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
	binaryProperties: string[],
	url: string,
	i: number,
): Promise<IDataObject[]> {
	const uploadUrl = `${url}/api/v2/media`;
	// Bind a typed version of handleApiRequest for use in this helper
	const ha = bindHandleApiRequest(this);
	const media: IDataObject[] = [];

	for (const binaryPropertyName of binaryProperties) {
		const binaryData = items[i].binary as IBinaryKeyData;

		if (!binaryData) {
			throw new NodeOperationError(
				this.getNode(),
				'No binary data exists. So file cannot be written!',
				{ itemIndex: i },
			);
		}

		if (!binaryData[binaryPropertyName]) {
			continue;
		}

		const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
		const file = {
			value: buffer,
			options: {
				filename: binaryData[binaryPropertyName].fileName,
				contentType: binaryData[binaryPropertyName].mimeType,
			},
		};

		const formData = { file };
		const response = await ha<IDataObject>('POST', uploadUrl, {}, {}, { formData });
		let responseUrl = (response as IDataObject).url as string;

		const mediaStatusUrl = `${url}/api/v1/media/${(response as IDataObject).id}`;
		let attempts = 0;

		while (!responseUrl && attempts < 10) {
			const statusResponse = await ha<IDataObject>('GET', mediaStatusUrl);
			responseUrl = (statusResponse as IDataObject).url as string;
			attempts++;
			await sleep(5000);
		}

		if (!responseUrl) {
			throw new NodeOperationError(this.getNode(), 'Unable to upload media to Mastodon', {
				itemIndex: i,
			});
		}

		media.push(response as IDataObject);
	}

	return media;
}

// Input validation utilities
export class ValidationUtils {
	/** The default maximum character length for Mastodon status posts */
	static readonly MASTODON_MAX_STATUS_LENGTH = 500;

	/* Character count that Mastodon uses for all URLs regardless of actual length
	 * https://github.com/mastodon/mastodon/blob/0219b7cad7d9ef800f82cc561571b70da040433f/app/validators/status_length_validator.rb#L5
	 */
	static readonly MASTODON_URL_LENGTH = 23;

	/**
	 * URL detection regex adapted from twitter-text library.
	 * Matches http/https URLs with proper boundary detection
	 */
	private static readonly URL_REGEX = /https?:\/\/[^\s<>"\{\}\|\\\^\[\]`]+/gi;

	/**
	 * Extract URLs from text with their positions
	 */
	static extractUrls(text: string): Array<{ url: string; startIndex: number; endIndex: number }> {
		const urls: Array<{ url: string; startIndex: number; endIndex: number }> = [];
		const regex = new RegExp(this.URL_REGEX);
		let match: RegExpExecArray | null;

		while (true) {
			match = regex.exec(text);
			if (match === null) break;

			const raw = match[0];

			// Trim common surrounding punctuation that shouldn't be part of the URL
			// e.g. trailing punctuation like .,!?;: and closing parens/brackets
			let url = raw.replace(/^["'\(\[<]+/, '');
			url = url.replace(/[\)\]\.,!?:;"'`>]+$/g, '');

			// If trimming removed leading chars, adjust the start index accordingly
			const relativeIndex = raw.indexOf(url);
			const startIndex = match.index + (relativeIndex >= 0 ? relativeIndex : 0);
			const endIndex = startIndex + url.length;

			urls.push({ url, startIndex, endIndex });
		}

		return urls;
	}

	/**
	 * Calculate the effective character length for Mastodon
	 * URLs count as 23 characters regardless of actual length
	 */
	static calculateMastodonLength(text: string): number {
		if (!text) return 0;

		const urls = this.extractUrls(text);

		if (urls.length === 0) {
			return text.length;
		}

		// Start with actual text length
		let effectiveLength = text.length;

		// Subtract actual URL length and add Mastodon's normalized URL length for each URL
		for (const link of urls) {
			const actualUrlLength = link.url.length;
			effectiveLength = effectiveLength - actualUrlLength + ValidationUtils.MASTODON_URL_LENGTH;
		}

		return effectiveLength;
	}

	/**
	 * Truncate text to fit within Mastodon's max status length.
	 *
	 * Mastodon counts all URLs as the same length, doesn't matter if they're longer or shorter.
	 * This function uses "effective length" (URL-aware counting) when URLs are present,
	 * and "actual length" (plain character count) when no URLs exist.
	 *
	 * When truncation would break a URL in half, the entire URL is removed instead,
	 * since partial URLs don't help and might make it harder to debug.
	 */
	static truncateWithUrlPreservation(
		text: string,
		maxLength: number = ValidationUtils.MASTODON_MAX_STATUS_LENGTH,
	): string {
		if (typeof text !== 'string') {
			throw new Error(`Expected string parameter, got ${typeof text}`);
		}

		const urls = this.extractUrls(text);

		// No URLs - use simple actual character length
		if (urls.length === 0) {
			return text.length <= maxLength ? text : text.slice(0, maxLength);
		}

		// Has URLs - use Mastodon's effective length
		const effectiveLength = this.calculateMastodonLength(text);

		if (effectiveLength <= maxLength) {
			return text;
		}

		const excessLength = effectiveLength - maxLength;
		const targetActualLength = text.length - excessLength;

		// Check if truncating at targetActualLength would cut through the middle of a URL
		for (const urlInfo of urls) {
			if (targetActualLength > urlInfo.startIndex && targetActualLength < urlInfo.endIndex) {
				// Would break this URL - truncate before the URL instead (removes it entirely)
				return text.slice(0, urlInfo.startIndex);
			}
		}

		// Safe to truncate at calculated position without breaking any URLs
		return text.slice(0, targetActualLength);
	}

	static validateRequiredParameters(params: { [key: string]: unknown }, required: string[]): void {
		const missing = required.filter(
			(param) => params[param] === undefined || params[param] === null,
		);
		if (missing.length > 0) {
			throw new Error(`Missing required parameters: ${missing.join(', ')}`);
		}
	}

	static sanitizeStringParam(
		value: unknown,
		maxLength: number = ValidationUtils.MASTODON_MAX_STATUS_LENGTH,
	): string {
		if (typeof value !== 'string') {
			throw new Error(`Expected string parameter, got ${typeof value}`);
		}
		return value.trim().slice(0, maxLength);
	}
}

// Add optimized bulk operations
export async function bulkOperation<T>(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
	operation: (item: INodeExecutionData, index: number) => Promise<T>,
	options: {
		batchSize?: number;
		continueOnError?: boolean;
		validateItem?: (item: INodeExecutionData) => boolean;
	} = {},
): Promise<T[]> {
	const { batchSize = 3, continueOnError = false, validateItem = () => true } = options;

	const results: T[] = [];
	const errors: Error[] = [];

	for (let i = 0; i < items.length; i += batchSize) {
		const batch = items.slice(i, i + batchSize);
		const batchPromises = batch.map(async (item, index) => {
			const actualIndex = i + index;

			try {
				if (!validateItem(item)) {
					throw new Error(`Validation failed for item ${actualIndex}`);
				}
				return await operation(item, actualIndex);
			} catch (error) {
				if (!continueOnError) {
					throw error;
				}
				errors.push(error);
				return null;
			}
		});

		const batchResults = await Promise.all(batchPromises);
		results.push(...(batchResults.filter((r): r is Awaited<T> => r !== null) as T[]));

		if (i + batchSize < items.length) {
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}
	}

	if (errors.length > 0 && !continueOnError) {
		throw new Error(`Multiple errors occurred: ${errors.map((e) => e.message).join('; ')}`);
	}

	return results;
}
