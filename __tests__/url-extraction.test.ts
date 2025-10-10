import { ValidationUtils } from '../nodes/Mastodon/Mastodon_Methods';

describe('ValidationUtils.extractUrls', () => {
	it('should return empty array when no URLs present', () => {
		const text = 'Just some regular text without any links';
		const urls = ValidationUtils.extractUrls(text);

		expect(urls).toHaveLength(0);
	});

	it('should extract a simple HTTP URL', () => {
		const text = 'Check out https://example.com for more info';
		const urls = ValidationUtils.extractUrls(text);

		expect(urls).toHaveLength(1);
		expect(urls[0]).toEqual({
			url: 'https://example.com',
			startIndex: 10,
			endIndex: 29,
		});
	});

	it('should extract multiple URLs', () => {
		const text = 'Visit https://example.com and http://test.org today';
		const urls = ValidationUtils.extractUrls(text);

		expect(urls).toHaveLength(2);
		expect(urls[0].url).toBe('https://example.com');
		expect(urls[1].url).toBe('http://test.org');
	});

	it('should extract URL with path and query parameters', () => {
		const text = 'See https://example.com/path/to/page?id=123&ref=test#section2';
		const urls = ValidationUtils.extractUrls(text);

		expect(urls).toHaveLength(1);
		expect(urls[0].url).toBe('https://example.com/path/to/page?id=123&ref=test#section2');
	});

	it('should extract URL at the start of text', () => {
		const text = 'https://example.com is a great site';
		const urls = ValidationUtils.extractUrls(text);

		expect(urls).toHaveLength(1);
		expect(urls[0].startIndex).toBe(0);
	});

	it('should extract URL at the end of text', () => {
		const text = 'Visit https://example.com';
		const urls = ValidationUtils.extractUrls(text);

		expect(urls).toHaveLength(1);
		expect(urls[0].endIndex).toBe(text.length);
	});
});
