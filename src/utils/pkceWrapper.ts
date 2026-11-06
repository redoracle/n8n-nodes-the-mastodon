/** RFC 7636 S256 PKCE generation without runtime third-party dependencies. */
import { createHash, randomBytes } from 'crypto';

export async function generatePKCE(): Promise<{ code_verifier: string; code_challenge: string }> {
	const code_verifier = randomBytes(32).toString('base64url');
	const code_challenge = createHash('sha256').update(code_verifier, 'ascii').digest('base64url');
	return { code_verifier, code_challenge };
}
