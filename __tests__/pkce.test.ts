import { createHash } from 'crypto';
import { generatePKCE } from '../src/utils/pkceWrapper';

describe('RFC 7636 PKCE', () => {
	it('uses a high-entropy URL-safe verifier and a matching S256 challenge', async () => {
		const first = await generatePKCE();
		const second = await generatePKCE();
		expect(first.code_verifier).toMatch(/^[A-Za-z0-9_-]{43}$/);
		expect(first.code_verifier).not.toBe(second.code_verifier);
		expect(first.code_challenge).toBe(
			createHash('sha256').update(first.code_verifier, 'ascii').digest('base64url'),
		);
	});
});
