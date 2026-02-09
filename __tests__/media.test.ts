import { IExecuteFunctions, NodeOperationError } from 'n8n-workflow';
import { Mastodon } from '../nodes/Mastodon/Mastodon.node';

describe('Mastodon Node - Media', () => {
	let node: Mastodon;
	let ctx: Partial<IExecuteFunctions>;

	beforeEach(() => {
		node = new Mastodon();
		ctx = {
			getNodeParameter: jest.fn(),
			getInputData: jest.fn(),
			helpers: {
				requestOAuth2: jest.fn(),
				getBinaryDataBuffer: jest.fn(),
			} as unknown as IExecuteFunctions['helpers'],
			getCredentials: jest.fn().mockResolvedValue({
				baseUrl: 'https://mastodon.social',
				oauth2: { accessToken: 'test-token' },
			}),
			continueOnFail: () => false,
			getNode: () =>
				({
					id: '1',
					type: 'mastodon',
					name: 'Mastodon',
					typeVersion: 1,
					position: [0, 0],
					parameters: {},
				}) as unknown as ReturnType<IExecuteFunctions['getNode']>,
		};
	});

	describe('upload', () => {
		it('should upload media with binary data', async () => {
			const mockMediaResponse = {
				id: 'media123',
				type: 'image',
				url: 'https://files.mastodon.social/media/123.jpg',
				preview_url: 'https://files.mastodon.social/media/123_small.jpg',
				remote_url: null,
				description: 'Test image',
				blurhash: 'UeKUpFxuo~R%0nW;WCnhF6RjaJt757oJodS$',
			};

			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'media';
				if (param === 'operation') return 'upload';
				if (param === 'binaryPropertyName') return 'data';
				if (param === 'additionalFields') return { description: 'Test image' };
				return undefined;
			});

			(ctx.getInputData as jest.Mock).mockReturnValue([
				{
					json: {},
					binary: {
						data: {
							fileName: 'test.jpg',
							mimeType: 'image/jpeg',
							data: 'base64data',
						},
					},
				},
			]);

			(ctx.helpers!.getBinaryDataBuffer as jest.Mock).mockResolvedValue(
				Buffer.from('fake-image-data'),
			);
			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockMediaResponse);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.getBinaryDataBuffer).toHaveBeenCalledWith(0, 'data');
			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalled();
			expect(result[0][0].json).toEqual(mockMediaResponse);
		});

		it('should throw error when binary data is missing', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'media';
				if (param === 'operation') return 'upload';
				if (param === 'binaryPropertyName') return 'data';
				if (param === 'additionalFields') return {};
				return undefined;
			});

			(ctx.getInputData as jest.Mock).mockReturnValue([{ json: {}, binary: undefined }]);

			await expect(node.execute.call(ctx as IExecuteFunctions)).rejects.toThrow(NodeOperationError);
		});
	});

	describe('update', () => {
		it('should update media description', async () => {
			const mockMediaResponse = {
				id: 'media123',
				type: 'image',
				url: 'https://files.mastodon.social/media/123.jpg',
				description: 'Updated description',
			};

			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'media';
				if (param === 'operation') return 'update';
				if (param === 'mediaId') return 'media123';
				if (param === 'updateFields') return { description: 'Updated description' };
				return undefined;
			});

			(ctx.getInputData as jest.Mock).mockReturnValue([{ json: {} }]);
			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue(mockMediaResponse);

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					method: 'PUT',
					uri: expect.stringContaining('/api/v1/media/media123'),
					body: expect.objectContaining({
						description: 'Updated description',
					}),
				}),
			);
			expect(result[0][0].json).toEqual(mockMediaResponse);
		});

		it('should update media with focus point', async () => {
			(ctx.getNodeParameter as jest.Mock).mockImplementation((param) => {
				if (param === 'resource') return 'media';
				if (param === 'operation') return 'update';
				if (param === 'mediaId') return 'media123';
				if (param === 'updateFields') return { focus: { x: 0.5, y: -0.3 } };
				return undefined;
			});

			(ctx.getInputData as jest.Mock).mockReturnValue([{ json: {} }]);
			(ctx.helpers!.requestOAuth2 as jest.Mock).mockResolvedValue({
				id: 'media123',
				meta: { focus: { x: 0.5, y: -0.3 } },
			});

			const result = await node.execute.call(ctx as IExecuteFunctions);

			expect(ctx.helpers!.requestOAuth2).toHaveBeenCalledWith(
				'mastodonOAuth2Api',
				expect.objectContaining({
					method: 'PUT',
					uri: expect.stringContaining('/api/v1/media/media123'),
					body: expect.objectContaining({
						focus: {
							x: 0.5,
							y: -0.3,
						},
					}),
				}),
			);
			expect(result?.[0]?.[0].json).toEqual({
				id: 'media123',
				meta: { focus: { x: 0.5, y: -0.3 } },
			});
		});
	});
});
