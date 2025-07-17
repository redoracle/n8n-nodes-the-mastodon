import { RequestQueue } from '../nodes/Mastodon/Mastodon_Methods';

// Mock Logger to avoid import issues in tests
jest.mock('n8n-workflow', () => ({
	LoggerProxy: {
		debug: jest.fn(),
		info: jest.fn(),
		warn: jest.fn(),
		error: jest.fn(),
	},
}));

describe('RequestQueue Rate Limit Handling', () => {
	let queue: any;

	beforeEach(() => {
		// Reset singleton instance
		(RequestQueue as any).instance = undefined;
		queue = RequestQueue.getInstance();
		// Clear any existing timers
		jest.clearAllTimers();
	});

	afterEach(() => {
		// Properly destroy the queue instance to clean up timers
		if (queue && typeof queue.destroy === 'function') {
			queue.destroy();
		}
		// Clear any existing timers
		jest.clearAllTimers();
		jest.useRealTimers();
	});

	afterAll(() => {
		// Final cleanup - ensure no lingering timers or instances
		if (queue && typeof queue.destroy === 'function') {
			queue.destroy();
		}
		(RequestQueue as any).instance = undefined;
		jest.clearAllTimers();
		jest.useRealTimers();
	});

	it('should handle rate limit properly', async () => {
		// Set rate limit to 0 with reset in 2 seconds
		const resetTime = Math.floor(Date.now() / 1000) + 2;
		queue.updateRateLimits(0, resetTime);

		const startTime = Date.now();

		// This request should wait for rate limit reset
		await queue.add(async () => {
			return { success: true };
		});

		const endTime = Date.now();
		const waitTime = endTime - startTime;

		// Should have waited at least 1 second (allowing for timing variance)
		expect(waitTime).toBeGreaterThan(1000);
	});

	it('should process requests sequentially', async () => {
		const results: number[] = [];
		const promises = [];

		// Add multiple requests
		for (let i = 0; i < 5; i++) {
			promises.push(
				queue.add(async () => {
					await new Promise(resolve => setTimeout(resolve, 100));
					results.push(i);
					return i;
				})
			);
		}

		await Promise.all(promises);

		// Results should be in order (sequential processing)
		expect(results).toEqual([0, 1, 2, 3, 4]);
	});

	it('should track rate limit usage correctly', () => {
		queue.updateRateLimits(10, Math.floor(Date.now() / 1000) + 300);

		const status = queue.getStatus();
		expect(status.rateLimitRemaining).toBe(10);
		expect(status.queueLength).toBe(0);
		expect(status.processing).toBe(false);
	});

	it('should have queue overflow protection', () => {
		// Test that the queue has a maximum size limit
		const MAX_QUEUE_SIZE = (queue as any).MAX_QUEUE_SIZE;
		expect(MAX_QUEUE_SIZE).toBe(1000);

		// Test that the queue tracks its length
		const status = queue.getStatus();
		expect(status.queueLength).toBeDefined();
		expect(typeof status.queueLength).toBe('number');
	});

	it('should have timeout mechanism for queued requests', () => {
		// Test that the REQUEST_TIMEOUT is properly defined
		const REQUEST_TIMEOUT = (queue as any).REQUEST_TIMEOUT;
		expect(REQUEST_TIMEOUT).toBe(60000); // 60 seconds

		// Test that cleanup method exists
		expect(typeof (queue as any).cleanupExpiredRequests).toBe('function');
	});
});
