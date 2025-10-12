import { ValidationUtils } from '../nodes/Mastodon/Mastodon_Methods';

describe('ValidationUtils.truncateWithUrlPreservation', () => {
	it('should raise an error when passed non-string input', () => {
		// @ts-expect-error - intentionally passing wrong type to test runtime check
		expect(() => ValidationUtils.truncateWithUrlPreservation(123, 500))
			.toThrow('Expected string parameter, got number');
	});

	it('should not truncate text within the character limit', () => {
		const text = 'Short text with https://example.com';
		const result = ValidationUtils.truncateWithUrlPreservation(text, 500);

		expect(result).toBe(text);
	});

	it('should truncate plain text over the character characters', () => {
		const text = 'a'.repeat(600);
		const result = ValidationUtils.truncateWithUrlPreservation(text, 500);

		expect(result.length).toBe(500);
		expect(result).toBe('a'.repeat(500));
	});

	it('should preserve complete URL when truncating text after it', () => {
		const prefix = 'a'.repeat(460);
		const url = 'https://example.com/very/long/path/that/is/way/over/23/characters/long';
		const suffix = 'b'.repeat(50);
		const text = `${prefix} ${url} ${suffix}`;

		const result = ValidationUtils.truncateWithUrlPreservation(text, 500);

		// Should keep prefix (460) + space (1) + URL (70 actual, 23 effective) + space (1) = 485 effective, 532 actual
		// Leaves room for 15 chars of suffix to reach 500 total, i.e. actual 547
		expect(result).toBe(text.substring(0, 547));
		expect(ValidationUtils.calculateMastodonLength(text)).toBe(535);
	});

	it('should truncate *before* URLs if we need to truncate a URL', () => {
		// 495 chars + 1 space + URL (23 effective) = 519 effective
		const prefix = 'a'.repeat(495);
		const url = 'https://example.com/long/path';
		const text = `${prefix} ${url}`;

		const result = ValidationUtils.truncateWithUrlPreservation(text, 500);

		// Should truncate before the URL
		expect(result).toEqual(`${prefix} `);
		expect(ValidationUtils.calculateMastodonLength(result)).toBe(496);
	});

	it('should preserve first URL and truncate after second URL', () => {
		const text = 'Check https://example.com and https://test.org ' + 'x'.repeat(500);
		const result = ValidationUtils.truncateWithUrlPreservation(text, 500);

		expect(result).not.toBe(text);
		// First URL: 19 actual → 23 effective (+4)
		// Second URL: 16 actual → 23 effective (+7)
		// URLs inflate effective length by 11, so truncate at 500 - 11 = 489
		expect(result).toBe(text.substring(0, 500 - 4 - 7));
		expect(ValidationUtils.calculateMastodonLength(result)).toBe(500);
	});

	it('should handle URL at the end of long text', () => {
		const prefix = 'a'.repeat(476);
		const url = 'https://example.com/some/path'; // 29 actual, 23 effective
		const text = `${prefix} ${url}`;
		// Effective: 476 + 1 + 23 = 500 (fits exactly)

		const result = ValidationUtils.truncateWithUrlPreservation(text, 500);

		expect(result).toBe(text); // Should not truncate
		expect(ValidationUtils.calculateMastodonLength(text)).toBe(500);
	});

	it('should handle internationalized domain names (punycode) correctly', () => {
 		const prefix = 'a'.repeat(450);
 		const idn = 'https://xn--d1acpjx3f.xn--p1ai/path'; // example punycode domain
 		const text = `${prefix} ${idn} ${'b'.repeat(100)}`;

 		const result = ValidationUtils.truncateWithUrlPreservation(text, 500);

 		// The IDN should be counted as a URL (23 effective) and preserved if possible
 		expect(ValidationUtils.calculateMastodonLength(result)).toBeLessThanOrEqual(500);
 	});

	it('should not treat protocol-less text as URL (no leading http)', () => {
 		const text = 'Visit example.com/test today';
 		const result = ValidationUtils.truncateWithUrlPreservation(text, 20);

 		// Since no http/https prefix, it should behave as normal text
 		expect(result.length).toBe(20);
 	});

	it('should handle adjacent punctuation after URL', () => {
 		const text = 'See https://example.com,' + 'x'.repeat(480);
 		const result = ValidationUtils.truncateWithUrlPreservation(text, 500);

 		// Comma should not be considered part of URL and truncation should account for URL effective length
 		expect(ValidationUtils.calculateMastodonLength(result)).toBeLessThanOrEqual(500);
 	});

	it('should handle multiple consecutive URLs and truncate appropriately', () => {
 		const text = 'https://a.com https://b.com https://c.com ' + 'x'.repeat(470);
 		const result = ValidationUtils.truncateWithUrlPreservation(text, 500);

 		// Ensure result effective length is within limit
 		expect(ValidationUtils.calculateMastodonLength(result)).toBeLessThanOrEqual(500);
 	});
});
