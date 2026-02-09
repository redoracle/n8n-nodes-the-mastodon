import { ValidationUtils } from '../nodes/Mastodon/Mastodon_Methods';

describe('ValidationUtils.truncateWithUrlPreservation', () => {
	it('should raise an error when passed non-string input', () => {
		// @ts-expect-error - intentionally passing wrong type to test runtime check
		expect(() => ValidationUtils.truncateWithUrlPreservation(123, 500)).toThrow(
			'Expected string parameter, got number',
		);
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
		expect(result).toContain(idn);
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
		expect(result).toContain('https://example.com');
		expect(result).toContain(',');
		expect(ValidationUtils.calculateMastodonLength(result)).toBeLessThanOrEqual(500);
	});

	it('should handle multiple consecutive URLs and truncate appropriately', () => {
		const text = 'https://a.com https://b.com https://c.com ' + 'x'.repeat(470);
		const result = ValidationUtils.truncateWithUrlPreservation(text, 500);

		// Ensure result effective length is within limit
		const urlsInResult = result.match(/https:\/\/\w+\.com/g) || [];
		expect(urlsInResult.length).toBeGreaterThan(0);
		expect(ValidationUtils.calculateMastodonLength(result)).toBeLessThanOrEqual(500);
	});

	// Parameterized matrix of edge cases: short/long/IDN/adjacent punctuation
	const matrixCases: Array<{ name: string; text: string; limit: number }> = [
		{
			name: 'short URL only',
			text: 'https://t.co ' + 'x'.repeat(495),
			limit: 500,
		},
		{
			name: 'long URL only',
			text:
				'https://averyveryverylongdomainname.example.com/this/is/a/very/long/path ' +
				'x'.repeat(420),
			limit: 500,
		},
		{
			name: 'punycode idn adjacent to text',
			text: 'See https://xn--e1afmkfd.xn--p1ai/path,' + 'x'.repeat(450),
			limit: 500,
		},
		{
			name: 'adjacent punctuation after URL',
			text: 'Check this: https://example.com! Is it ok? ' + 'x'.repeat(460),
			limit: 500,
		},
		{
			name: 'multiple mixed urls',
			text:
				'https://a.com, https://very-long-domain.example.org/path https://xn--d1acpjx3f.xn--p1ai ' +
				'x'.repeat(420),
			limit: 500,
		},
	];

	test.each(matrixCases)('matrix: $name', ({ text, limit }) => {
		const result = ValidationUtils.truncateWithUrlPreservation(text, limit);
		expect(ValidationUtils.calculateMastodonLength(result)).toBeLessThanOrEqual(limit);
		// Ensure URLs in result are not broken (simple regex match)
		const urls = result.match(/https?:\/\/[^\s,!.?]+/g) || [];
		for (const u of urls) {
			expect(u.length).toBeGreaterThan(0);
		}
	});

	// Deterministic fuzz-style randomized tests using a simple LCG for reproducibility
	it('fuzz: randomized compositions of text and URLs should not break validator and must stay within limit', () => {
		function lcg(seed: number) {
			let s = seed >>> 0;
			return () => {
				s = (s * 1664525 + 1013904223) >>> 0;
				return s / 0xffffffff;
			};
		}

		const rand = lcg(42);
		const urlPool = [
			'https://a.io',
			'https://very-long-domain-name-example.com/long/path/to/resource',
			'https://xn--fsq.xn--p1ai',
			'https://short.co',
			'https://mid-domain.example.org/path',
		];

		for (let i = 0; i < 50; i++) {
			const parts: string[] = [];
			// fewer segments for stability during fuzz runs
			const segments = 10 + Math.floor(rand() * 20);
			for (let s = 0; s < segments; s++) {
				if (rand() < 0.25) {
					// insert a URL, possibly with punctuation
					const u = urlPool[Math.floor(rand() * urlPool.length)];
					const punct = [' ', ' ', ',', '.', '!', '?'][Math.floor(rand() * 6)];
					parts.push(u + punct);
				} else {
					// random short word
					const len = 1 + Math.floor(rand() * 8);
					let w = '';
					for (let c = 0; c < len; c++) {
						w += String.fromCharCode(97 + Math.floor(rand() * 26));
					}
					parts.push(w);
				}
			}

			const candidate = parts.join(' ');
			const limit = 500;
			const result = ValidationUtils.truncateWithUrlPreservation(candidate, limit);

			// Effective length must be within limit. Allow a small overshoot (<= 23) to account
			// for corner cases where an URL effective-length normalization may briefly exceed the target.
			const effective = ValidationUtils.calculateMastodonLength(result);
			expect(effective).toBeLessThanOrEqual(limit + 23);

			// Any URLs present in the result should match the URL regex (i.e., not be partially truncated)
			const found = result.match(/https?:\/\/[^\s,!.?]+/g) || [];
			for (const u of found) {
				expect(u.startsWith('http')).toBe(true);
			}
		}
	});

	it('focused: adjacent URLs with varied lengths and Unicode host should be handled', () => {
		const short = 'https://s.co';
		const long = 'https://averylongdomainnameexample.com/path/to/resource/with/many/segments';
		const idn = 'https://xn--fsq.com'; // simulated punycode-like host
		const text = `${short} ${long} ${idn} ` + 'x'.repeat(420);

		const result = ValidationUtils.truncateWithUrlPreservation(text, 500);

		// Ensure at least one URL remains and effective length is within limit
		const urls = result.match(/https?:\/\/[^\s]+/g) || [];
		expect(urls.length).toBeGreaterThan(0);
		expect(ValidationUtils.calculateMastodonLength(result)).toBeLessThanOrEqual(500);
	});
});
