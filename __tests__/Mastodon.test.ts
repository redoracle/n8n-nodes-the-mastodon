import { Mastodon } from '../nodes/Mastodon/Mastodon.node';
import { INodeType, INodeProperties } from 'n8n-workflow';

describe('Mastodon Node - Core', () => {
	let mastodonNode: INodeType;

	beforeAll(() => {
		mastodonNode = new Mastodon();
	});

	test('should have correct node metadata', () => {
		expect(mastodonNode.description.name).toBe('mastodon');
		expect(mastodonNode.description.displayName).toBe('Mastodon');
		expect(mastodonNode.description.group).toEqual(['transform']);
		expect(mastodonNode.description.version).toBe(1);
	});

	test('should define required OAuth2 credentials', () => {
		const creds = mastodonNode.description.credentials;
		expect(creds).toBeDefined();
		expect(creds?.[0].name).toBe('mastodonOAuth2Api');
		expect(creds?.[0].required).toBe(true);
	});

	test('should include URL property as required string', () => {
		const props = mastodonNode.description.properties as INodeProperties[];
		const urlProp = props.find((p) => p.name === 'url');
		expect(urlProp).toBeDefined();
		expect(urlProp?.type).toBe('string');
		expect(urlProp?.required).toBe(true);
	});
});
