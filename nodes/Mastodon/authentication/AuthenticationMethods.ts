import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	NodeOperationError,
} from 'n8n-workflow';
import { handleApiRequest } from '../Mastodon_Methods';

interface IOAuthServerConfig extends IDataObject {
	issuer: string;
	authorization_endpoint: string;
	token_endpoint: string;
	scopes_supported: string[];
	response_types_supported: string[];
	code_challenge_methods_supported: string[];
	grant_types_supported: string[];
}

export async function discoverOAuthConfig(
	this: IExecuteFunctions,
	baseUrl: string,
): Promise<IOAuthServerConfig | null> {
	try {
		const response = await handleApiRequest.call(
			this,
			'GET',
			`${baseUrl}/.well-known/oauth-authorization-server`,
		);
		return response as IOAuthServerConfig;
	} catch (error) {
		// Endpoint not available (pre-4.3.0), return null
		return null;
	}
}

async function registerApp(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IDataObject> {
	const clientName = this.getNodeParameter('clientName', i) as string;
	const redirectUris = this.getNodeParameter('redirectUris', i) as string;
	const scopes = this.getNodeParameter('scopes', i) as string;
	const website = this.getNodeParameter('website', i) as string;

	// Get OAuth server configuration to check supported scopes
	const config = await discoverOAuthConfig.call(this, baseUrl);

	if (config?.scopes_supported) {
		// Validate requested scopes against supported scopes
		const requestedScopes = scopes.split(' ');
		const unsupportedScopes = requestedScopes.filter(
			(scope: string) => !config.scopes_supported.includes(scope),
		);

		if (unsupportedScopes.length > 0) {
			throw new NodeOperationError(
				this.getNode(),
				`The following scopes are not supported by this Mastodon server: ${unsupportedScopes.join(', ')}`,
				{ description: `Supported scopes are: ${config.scopes_supported.join(', ')}` },
			);
		}
	}

	const body: IDataObject = {
		client_name: clientName,
		redirect_uris: redirectUris,
		scopes,
		website,
	};

	// Register the application
	return await handleApiRequest.call(this, 'POST', `${baseUrl}/api/v1/apps`, body);
}

async function obtainToken(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IDataObject> {
	const clientId = this.getNodeParameter('clientId', i) as string;
	const clientSecret = this.getNodeParameter('clientSecret', i) as string;
	const code = this.getNodeParameter('code', i) as string;
	const redirectUri = this.getNodeParameter('redirectUri', i) as string;

	// Get OAuth server configuration
	const config = await discoverOAuthConfig.call(this, baseUrl);

	// Check if PKCE is supported and we have a code verifier
	const credentials = await this.getCredentials('mastodonOAuth2Api');
	const code_verifier = (credentials as IDataObject).code_verifier as string;

	const body: IDataObject = {
		grant_type: 'authorization_code',
		client_id: clientId,
		client_secret: clientSecret,
		code,
		redirect_uri: redirectUri,
	};

	// Add PKCE code_verifier if supported and available
	if (config?.code_challenge_methods_supported?.includes('S256') && code_verifier) {
		body.code_verifier = code_verifier;
	}

	// Exchange the authorization code for an access token
	const response = (await handleApiRequest.call(
		this,
		'POST',
		`${baseUrl}/oauth/token`,
		body,
	)) as IDataObject;

	// Get the granted scopes from verify_credentials endpoint
	const verifyResponse = (await handleApiRequest.call(
		this,
		'GET',
		`${baseUrl}/api/v1/apps/verify_credentials`,
		{},
		{},
		{
			headers: {
				Authorization: `Bearer ${response.access_token}`,
			},
		},
	)) as { scopes: string[] };

	response.scopes = verifyResponse.scopes;

	// If OAuth discovery is supported, validate granted scopes
	if (config?.scopes_supported) {
		const grantedScopes = verifyResponse.scopes;
		const unsupportedScopes = grantedScopes.filter(
			(scope: string) => !config.scopes_supported.includes(scope),
		);

		if (unsupportedScopes.length > 0) {
			throw new NodeOperationError(
				this.getNode(),
				`Received unsupported scopes from server: ${unsupportedScopes.join(', ')}`,
				{ description: `This may indicate a version mismatch or server misconfiguration` },
			);
		}
	}

	return response;
}

async function revokeToken(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IDataObject> {
	const clientId = this.getNodeParameter('clientId', i) as string;
	const clientSecret = this.getNodeParameter('clientSecret', i) as string;
	const token = this.getNodeParameter('token', i) as string;

	const body: IDataObject = {
		client_id: clientId,
		client_secret: clientSecret,
		token,
	};

	// Revoke the access token
	return await handleApiRequest.call(this, 'POST', `${baseUrl}/oauth/revoke`, body);
}

export const authenticationMethods = {
	discoverOAuthConfig,
	registerApp,
	obtainToken,
	revokeToken,
};
