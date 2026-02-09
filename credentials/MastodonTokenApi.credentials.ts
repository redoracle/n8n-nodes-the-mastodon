import {
    IAuthenticate,
    Icon,
    ICredentialTestRequest,
    ICredentialType,
    INodeProperties
} from 'n8n-workflow';

export class MastodonTokenApi implements ICredentialType {
	name = 'mastodonTokenApi';
	displayName = 'Mastodon Access Token API';
	documentationUrl = 'https://docs.joinmastodon.org/client/token/';
	icon: Icon = 'file:Mastodon.svg';

	properties: INodeProperties[] = [
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
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Access token from your Mastodon instance. You can generate one in your Mastodon account settings under Development > Your applications.',
		},
	];

	authenticate: IAuthenticate = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.accessToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/api/v1/accounts/verify_credentials',
			method: 'GET',
		},
	};
}
