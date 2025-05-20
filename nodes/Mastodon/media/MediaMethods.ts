import {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
	NodeOperationError,
} from 'n8n-workflow';
import { handleApiRequest } from '../Mastodon_Methods';

interface IMediaAttachment {
	id: string;
	type: string;
	url: string;
	preview_url: string;
	remote_url: string | null;
	description: string | null;
	blurhash: string;
}

/**
 * Uploads media
 * POST /api/v1/media
 */
export async function upload(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IMediaAttachment> {
	const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
	const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
	const binaryData = items[i].binary?.[binaryPropertyName];

	if (!binaryData) {
		throw new NodeOperationError(this.getNode(), 'No binary data exists on input item.');
	}

	const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
	const formData: { [key: string]: any } = {
		file: {
			value: buffer,
			options: {
				filename: binaryData.fileName,
				contentType: binaryData.mimeType,
			},
		},
	};

	if (additionalFields.description) {
		formData.description = additionalFields.description as string;
	}
	if (additionalFields.focus) {
		formData.focus = additionalFields.focus as string;
	}

	return await handleApiRequest.call(this, 'POST', `${baseUrl}/api/v1/media`, {}, {}, { formData });
}

/**
 * Updates media metadata
 * PUT /api/v1/media/:id
 */
export async function update(
	this: IExecuteFunctions,
	baseUrl: string,
	items: INodeExecutionData[],
	i: number,
): Promise<IMediaAttachment> {
	const mediaId = this.getNodeParameter('mediaId', i) as string;
	const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

	const body: IDataObject = {};
	if (updateFields.description) {
		body.description = updateFields.description;
	}
	if (updateFields.focus) {
		body.focus = updateFields.focus;
	}

	return await handleApiRequest.call(this, 'PUT', `${baseUrl}/api/v1/media/${mediaId}`, body);
}
