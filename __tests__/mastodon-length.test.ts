import { ValidationUtils } from '../nodes/Mastodon/Mastodon_Methods';

describe('ValidationUtils.calculateMastodonLength', () => {
	it('should return 0 for empty string', () => {
		expect(ValidationUtils.calculateMastodonLength('')).toBe(0);
	});

	it('should return 23 for text that is only a URL', () => {
		const text = 'https://example.com/very/long/path';
		const length = ValidationUtils.calculateMastodonLength(text);

		expect(length).toBe(23);
	});

	it('should return actual length when no URLs present', () => {
		const text = 'Hello world';

		const length = ValidationUtils.calculateMastodonLength(text);

		expect(length).toBe(11);
	});

	it('should count short URL as 23 characters', () => {
		// URL "https://example.com" = 19 chars actual, counts as 23
		const text = 'Check https://example.com out';

		const length = ValidationUtils.calculateMastodonLength(text);

		// Actual: 29 chars
		// Expected: 29 - 19 + 23 = 33
		expect(length).toBe(33);
	});

	it('should count long URL as only 23 characters', () => {
		// URL = 92 chars actual, counts as 23
		const text =
			'Read https://example.com/very/long/path/to/article/with/many/segments?param1=value1&param2=value2';

		const length = ValidationUtils.calculateMastodonLength(text);

		// Actual: 97 chars
		// Expected: 97 - 92 + 23 = 28
		expect(length).toBe(28);
	});

	it('should count multiple URLs correctly', () => {
		const text = 'Check https://example.com and https://test.org for info';

		const length = ValidationUtils.calculateMastodonLength(text);

		// Total actual: 55
		// Total effective: 6 + 23 + 5 + 23 + 9 = 66
		expect(length).toBe(66);
	});
});
