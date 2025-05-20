import {
	ICredentialType,
	INodeProperties,
	Icon,
	IAuthenticate,
	ICredentialTestRequest,
	ICredentialsDecrypted,
	INodeCredentialTestResult,
	IDataObject,
	JsonObject,
	IHttpRequestHelper,
	ICredentialDataDecryptedObject,
} from 'n8n-workflow';
import { generatePKCE } from '../src/utils/pkceWrapper';

interface IVerifyCredentialsResponse {
	name: string;
	website: string | null;
	vapid_key: string;
	scopes: string[];
}

interface IOAuthServerConfig {
	issuer: string;
	authorization_endpoint: string;
	token_endpoint: string;
	scopes_supported: string[];
	response_types_supported: string[];
	code_challenge_methods_supported: string[];
	grant_types_supported: string[];
}

interface IMastodonCredentials extends ICredentialDataDecryptedObject {
	clientId: string;
	clientSecret: string;
	baseUrl: string;
	// Removed oauth2 property to fix TS2411 error
}

export class MastodonOAuth2Api implements ICredentialType {
	name = 'mastodonOAuth2Api';
	extends = ['oAuth2Api'];
	displayName = 'Mastodon OAuth2 API';
	documentationUrl = 'https://docs.joinmastodon.org/api/oauth-scopes/';
	icon: Icon = 'file:Mastodon.svg';

	properties: INodeProperties[] = [
		{
			displayName: 'Grant Type',
			name: 'grantType',
			type: 'hidden',
			default: 'authorizationCode',
		},
		{
			displayName: 'Mastodon Instance URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://mastodon.social',
			placeholder: 'https://mastodon.social',
			required: true,
			description: 'The base URL of your Mastodon instance (e.g., https://mastodon.social)',
		},
		{
			displayName: 'Authorization URL',
			name: 'authUrl',
			type: 'hidden',
			default: '={{$self.baseUrl}}/oauth/authorize',
			required: true,
		},
		{
			displayName: 'Access Token URL',
			name: 'accessTokenUrl',
			type: 'hidden',
			default: '={{$self.baseUrl}}/oauth/token',
			required: true,
		},
		{
			displayName: 'Client ID',
			name: 'clientId',
			type: 'string',
			default: '',
			required: true,
		},
		{
			displayName: 'Client Secret',
			name: 'clientSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
		},
		// Override the default scope field to handle Mastodon scopes
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'hidden',
			default: 'read write follow push',
			description: 'The scopes to request. Multiple scopes can be separated by spaces.',
		},
		{
			displayName: 'Current Scopes',
			name: 'currentScopes',
			type: 'string',
			default: '',
			required: false,
			displayOptions: {
				show: {
					grantType: ['authorizationCode'],
				},
			},
			description: 'The OAuth scopes that are currently granted to this application',
		},
	];

	// PKCE Storage with static helper methods to handle storage access
	private static pkceStorage = new Map<string, { code_verifier: string; expires: number }>();

	private static storePKCE(clientId: string, code_verifier: string): void {
		MastodonOAuth2Api.pkceStorage.set(clientId, {
			code_verifier,
			expires: Date.now() + 10 * 60 * 1000, // 10 minutes
		});
	}

	private static getStoredPKCE(clientId: string): string | undefined {
		const stored = MastodonOAuth2Api.pkceStorage.get(clientId);
		if (!stored) return undefined;

		// Clear expired entries
		if (stored.expires < Date.now()) {
			MastodonOAuth2Api.pkceStorage.delete(clientId);
			return undefined;
		}

		// Clear after use
		MastodonOAuth2Api.pkceStorage.delete(clientId);
		return stored.code_verifier;
	}

	authenticate: IAuthenticate = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials?.oauth2?.accessToken}}',
			},
			qs: {
				response_type: 'code',
				client_id: '={{$credentials.clientId}}',
				redirect_uri: '={{$credentials.redirectUri}}',
				scope: 'read write follow push',
				state: '={{Date.now()}}',
				force_login: true, // Always force login to support multiple accounts
			},
		},
	};

	async preAuthentication(
		this: IHttpRequestHelper,
		credentials: ICredentialDataDecryptedObject,
	): Promise<IDataObject> {
		const mastodonCredentials = credentials as IMastodonCredentials;

		// Generate and store PKCE values
		const { code_verifier, code_challenge } = await generatePKCE();
		MastodonOAuth2Api.storePKCE(mastodonCredentials.clientId, code_verifier);

		// Check if server supports PKCE
		try {
			const response = await fetch(
				`${mastodonCredentials.baseUrl}/.well-known/oauth-authorization-server`,
			);
			if (response.ok) {
				const config = (await response.json()) as IOAuthServerConfig;
				if (config.code_challenge_methods_supported?.includes('S256')) {
					return {
						code_challenge,
						code_challenge_method: 'S256',
					};
				}
			}
		} catch (error) {
			// Server doesn't support discovery, continue without PKCE
		}

		return {};
	}

	async postAuthentication(
		this: IHttpRequestHelper,
		credentials: ICredentialDataDecryptedObject,
	): Promise<IDataObject> {
		const mastodonCredentials = credentials as IMastodonCredentials;
		let accessToken: string | undefined;
		if (
			typeof credentials === 'object' &&
			credentials !== null &&
			'oauth2' in credentials &&
			typeof (credentials as any).oauth2 === 'object' &&
			(credentials as any).oauth2 !== null &&
			'accessToken' in (credentials as any).oauth2
		) {
			accessToken = (credentials as any).oauth2.accessToken;
		} else if (
			typeof credentials === 'object' &&
			credentials !== null &&
			'accessToken' in credentials
		) {
			accessToken = (credentials as any).accessToken;
		}
		if (!accessToken) return {};

		try {
			const response = await fetch(
				`${mastodonCredentials.baseUrl}/api/v1/apps/verify_credentials`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
						Accept: 'application/json',
					},
				},
			);
			if (response.ok) {
				const data = (await response.json()) as IVerifyCredentialsResponse;
				if (data.scopes) {
					return {
						currentScopes: Array.isArray(data.scopes) ? data.scopes.join(' ') : String(data.scopes),
					};
				}
			}
		} catch (e) {
			// ignore
		}
		return {};
	}

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials?.baseUrl}}',
			url: '/api/v1/apps/verify_credentials',
			method: 'GET',
			headers: {
				Accept: 'application/json',
			},
		},
		rules: [
			{
				type: 'responseSuccessBody',
				properties: {
					message: 'Successfully connected to Mastodon',
					key: 'currentScopes',
					value: '={{$response.body.scopes.join(" ")}}',
				},
			},
		],
	};

	async applyCredentials(
		this: IHttpRequestHelper,
		requestOptions: IDataObject,
	): Promise<IDataObject> {
		const credentials = requestOptions.credentials as any;

		// Add PKCE code_verifier if we have one stored
		const code_verifier = MastodonOAuth2Api.getStoredPKCE(credentials.clientId);
		if (code_verifier) {
			(requestOptions.body as IDataObject).code_verifier = code_verifier;
		}

		// Ensure access token is available under credentials.oauth2.accessToken
		if (!credentials.oauth2 || !credentials.oauth2.accessToken) {
			// Map from oauthTokenData if present (n8n default for OAuth2)
			const accessToken =
				credentials.oauthTokenData?.access_token ||
				credentials.access_token ||
				credentials.accessToken;
			if (accessToken) {
				credentials.oauth2 = { accessToken };
			}
		}

		return requestOptions;
	}
}
