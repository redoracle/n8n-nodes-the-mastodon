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

describe('Mastodon Node - Status Context', () => {
	let mastodonNode: INodeType;

	beforeAll(() => {
		mastodonNode = new Mastodon();
	});

	test('should include context operation for status resource', () => {
		const props = mastodonNode.description.properties as INodeProperties[];
		const op = props.find((p) => p.name === 'operation');
		expect(op).toBeDefined();
		const values = (op as any).options.map((o: any) => o.value);
		expect(values).toContain('context');
	});

	test('should define statusId field for context operation', () => {
		const props = mastodonNode.description.properties as INodeProperties[];
		// Find all fields named 'statusId'
		const statusIdFields = props.filter((p) => p.name === 'statusId');
		expect(statusIdFields.length).toBeGreaterThan(0);
		// Find the one scoped to the context operation
		const contextField = statusIdFields.find(
			(p) => p.displayOptions?.show?.operation?.includes('context'),
		);
		expect(contextField).toBeDefined();
		// Verify its field configuration
		expect(contextField?.type).toBe('string');
		expect(contextField?.required).toBe(true);
	});
});

describe('Mastodon Node - Context Options', () => {
	let mastodonNode: INodeType;

	beforeAll(() => {
		mastodonNode = new Mastodon();
	});

	test('should include additional options for context operation', () => {
		const props = mastodonNode.description.properties as INodeProperties[];
		const additionalOptions = props.find((p) => p.name === 'additionalOptions');
		expect(additionalOptions).toBeDefined();
		expect(additionalOptions?.type).toBe('collection');
		expect(additionalOptions?.displayOptions?.show?.operation).toContain('context');
	});

	test('should define return format options', () => {
		const props = mastodonNode.description.properties as INodeProperties[];
		const additionalOptions = props.find((p) => p.name === 'additionalOptions');
		const returnFormatOption = (additionalOptions as any)?.options?.find(
			(opt: any) => opt.name === 'returnFormat',
		);
		expect(returnFormatOption).toBeDefined();
		expect(returnFormatOption?.options).toHaveLength(3);
		expect(returnFormatOption?.options[0].value).toBe('structured');
		expect(returnFormatOption?.options[1].value).toBe('flat');
		expect(returnFormatOption?.options[2].value).toBe('tree');
	});

	test('should include private status handling option', () => {
		const props = mastodonNode.description.properties as INodeProperties[];
		const additionalOptions = props.find((p) => p.name === 'additionalOptions');
		const privateOption = (additionalOptions as any)?.options?.find(
			(opt: any) => opt.name === 'includePrivate',
		);
		expect(privateOption).toBeDefined();
		expect(privateOption?.type).toBe('boolean');
		expect(privateOption?.default).toBe(true);
	});

	test('should include max depth option', () => {
		const props = mastodonNode.description.properties as INodeProperties[];
		const additionalOptions = props.find((p) => p.name === 'additionalOptions');
		const depthOption = (additionalOptions as any)?.options?.find(
			(opt: any) => opt.name === 'maxDepth',
		);
		expect(depthOption).toBeDefined();
		expect(depthOption?.type).toBe('number');
		expect(depthOption?.default).toBe(20);
	});
});
