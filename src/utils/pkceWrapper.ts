/**
 * This file provides a CommonJS compatible wrapper around the pkce-challenge ESM module
 * to prevent the "require() of ES Module not supported" error
 */

// Using dynamic import to handle the ESM module
async function generatePKCE(): Promise<{ code_verifier: string; code_challenge: string }> {
	try {
		const { default: pkce } = await import('pkce-challenge');
		return pkce();
	} catch (error) {
		console.error('Error importing pkce-challenge:', error);
		throw error;
	}
}

export { generatePKCE };
