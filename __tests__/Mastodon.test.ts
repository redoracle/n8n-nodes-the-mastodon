import { INodeProperties, INodeType } from 'n8n-workflow';
import { Mastodon } from '../nodes/Mastodon/Mastodon.node';

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
		const options = (op as INodeProperties).options as
			| Array<{ name?: string; value?: string }>
			| undefined;
		const values = (options ?? []).map((o) => o.value as string);
		expect(values).toContain('context');
	});

	test('should define statusId field for context operation', () => {
		const props = mastodonNode.description.properties as INodeProperties[];
		// Find all fields named 'statusId'
		const statusIdFields = props.filter((p) => p.name === 'statusId');
		expect(statusIdFields.length).toBeGreaterThan(0);
		// Find the one scoped to the context operation
		const contextField = statusIdFields.find((p) =>
			p.displayOptions?.show?.operation?.includes('context'),
		);
		expect(contextField).toBeDefined();
		// Verify its field configuration
		expect(contextField?.type).toBe('string');
		expect(contextField?.required).toBe(true);
	});
});

describe('Mastodon Node - Context Options', () => {
	let mastodonNode: INodeType;

	// Helper to safely extract options array from a property
	const getOptionsLocal = (p: unknown): unknown[] | undefined => {
		if (!p) return undefined;
		const candidate = (p as { [k: string]: unknown })['options'];
		return Array.isArray(candidate) ? candidate : undefined;
	};

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
		const additionalOptions = props.find((p) => p.name === 'additionalOptions') as
			| INodeProperties
			| undefined;

		const opts = getOptionsLocal(additionalOptions);
		if (!opts) fail('additionalOptions not found or missing options array');
		const entry = opts.find((e: unknown) => (e as { name?: string }).name === 'returnFormat');
		if (!entry) fail('returnFormat option not found');
		const nested = (entry as { [k: string]: unknown })['options'];
		if (!Array.isArray(nested)) fail('returnFormat nested options missing');
		const nestedOpts = nested as unknown[];
		expect(nestedOpts).toHaveLength(3);
		expect((nestedOpts[0] as { value?: unknown }).value as string).toBe('structured');
		expect((nestedOpts[1] as { value?: unknown }).value as string).toBe('flat');
		expect((nestedOpts[2] as { value?: unknown }).value as string).toBe('tree');
	});

	test('should include private status handling option', () => {
		const props = mastodonNode.description.properties as INodeProperties[];
		const additionalOptions2 = props.find((p) => p.name === 'additionalOptions') as
			| INodeProperties
			| undefined;
		const opts2 = getOptionsLocal(additionalOptions2);
		if (!opts2) fail('additionalOptions not found or missing options array');
		const pOpt = opts2.find((e: unknown) => (e as { name?: string }).name === 'includePrivate');
		if (!pOpt) fail('includePrivate option not found');
		expect((pOpt as { [k: string]: unknown })['type'] as string).toBe('boolean');
		expect((pOpt as { [k: string]: unknown })['default'] as boolean).toBe(true);
	});

	test('should include max depth option', () => {
		const props = mastodonNode.description.properties as INodeProperties[];
		const additionalOptions3 = props.find((p) => p.name === 'additionalOptions') as
			| INodeProperties
			| undefined;
		const opts3 = getOptionsLocal(additionalOptions3);
		if (!opts3) fail('additionalOptions not found or missing options array');
		const dOpt = opts3.find((e: unknown) => (e as { name?: string }).name === 'maxDepth');
		if (!dOpt) fail('maxDepth option not found');
		expect((dOpt as { [k: string]: unknown })['type'] as string).toBe('number');
		expect((dOpt as { [k: string]: unknown })['default'] as number).toBe(20);
	});
});
