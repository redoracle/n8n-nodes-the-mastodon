// Global Jest setup to handle RequestQueue cleanup
const { RequestQueue } = require('./nodes/Mastodon/Mastodon_Methods');

// Clean up RequestQueue instances after each test to prevent Jest hanging
afterEach(() => {
	try {
		const queue = RequestQueue.getInstance();
		if (queue && typeof queue.destroy === 'function') {
			queue.destroy();
		}
	} catch (e) {
		// Queue might not exist or already be destroyed
	}
});

// Final cleanup after all tests
afterAll(() => {
	try {
		const queue = RequestQueue.getInstance();
		if (queue && typeof queue.destroy === 'function') {
			queue.destroy();
		}
	} catch (e) {
		// Queue might not exist or already be destroyed
	}
	// Clear singleton instance
	if (RequestQueue.instance !== undefined) {
		RequestQueue.instance = undefined;
	}
});
