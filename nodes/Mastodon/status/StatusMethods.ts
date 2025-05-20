import {
	IExecuteFunctions,
	INodeExecutionData,
	IBinaryKeyData,
	NodeOperationError,
	IDataObject,
} from 'n8n-workflow';
import { handleApiRequest, ValidationUtils } from '../Mastodon_Methods';
import { IStatusMethods } from './StatusMethodsTypes';

function validateStatusParam(this: IExecuteFunctions, i: number): string {
	const status = this.getNodeParameter('status', i);
	if (!status) {
		throw new NodeOperationError(this.getNode(), 'Status text is required');
	}
	return ValidationUtils.sanitizeStringParam(status as string, 500);
}

function validateStatusId(this: IExecuteFunctions, i: number): string {
	const statusId = this.getNodeParameter('statusId', i);
	if (!statusId) {
		throw new NodeOperationError(this.getNode(), 'Status ID is required');
	}
	return ValidationUtils.sanitizeStringParam(statusId as string);
}

const methods: IStatusMethods = {
	async create(this: IExecuteFunctions, baseUrl: string, items: INodeExecutionData[], i: number) {
		const status = validateStatusParam.call(this, i);
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
		const body: IDataObject = { status };

		// Handle media attachments with proper validation
		if (additionalFields.mediaIds) {
			const mediaIds = (additionalFields.mediaIds as string).split(',').map((id) => id.trim());
			if (mediaIds.length > 4) {
				throw new NodeOperationError(this.getNode(), 'Maximum of 4 media attachments allowed');
			}
			// If media is attached and no status text, validate per API requirements
			if (!status && mediaIds.length === 0) {
				throw new NodeOperationError(
					this.getNode(),
					'Either status text or media attachments must be provided',
				);
			}
			body.media_ids = mediaIds;
		}

		// Handle reply context
		if (additionalFields.inReplyToId) {
			body.in_reply_to_id = ValidationUtils.sanitizeStringParam(
				additionalFields.inReplyToId as string,
			);
		}

		// Content warnings and sensitivity
		if (additionalFields.sensitive !== undefined) {
			body.sensitive = !!additionalFields.sensitive;
		}
		if (additionalFields.spoilerText) {
			body.spoiler_text = ValidationUtils.sanitizeStringParam(
				additionalFields.spoilerText as string,
				100,
			);
		}

		// Visibility setting
		if (additionalFields.visibility) {
			body.visibility = ValidationUtils.sanitizeVisibility(additionalFields.visibility as string);
		}

		// Scheduled posting
		if (additionalFields.scheduledAt) {
			const scheduledDate = ValidationUtils.validateDateParam(
				additionalFields.scheduledAt as string,
			);
			// Ensure scheduled time is at least 5 minutes in the future per API requirement
			const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
			if (scheduledDate <= fiveMinutesFromNow) {
				throw new NodeOperationError(
					this.getNode(),
					'Scheduled time must be at least 5 minutes in the future',
				);
			}
			body.scheduled_at = scheduledDate.toISOString();
		}

		// Language setting
		if (additionalFields.language) {
			body.language = ValidationUtils.sanitizeStringParam(additionalFields.language as string, 2);
		}

		// Generate idempotency key to prevent duplicate submissions
		const idempotencyKey = require('crypto')
			.createHash('sha256')
			.update(JSON.stringify({ status, additionalFields, timestamp: Date.now() }))
			.digest('hex');

		// Make API request with idempotency key
		const result = await handleApiRequest.call(
			this,
			'POST',
			`${baseUrl}/api/v1/statuses`,
			body,
			{},
			{
				headers: {
					'Idempotency-Key': idempotencyKey,
				},
			},
		);
		return Array.isArray(result) ? result : [result || {}];
	},

	async view(this: IExecuteFunctions, baseUrl: string, items: INodeExecutionData[], i: number) {
		const statusId = validateStatusId.call(this, i);
		const result = await handleApiRequest.call(
			this,
			'GET',
			`${baseUrl}/api/v1/statuses/${statusId}`,
		);
		return Array.isArray(result) ? result : [result || {}];
	},

	async delete(this: IExecuteFunctions, baseUrl: string, items: INodeExecutionData[], i: number) {
		const statusId = validateStatusId.call(this, i);
		const result = await handleApiRequest.call(
			this,
			'DELETE',
			`${baseUrl}/api/v1/statuses/${statusId}`,
		);
		return Array.isArray(result) ? result : [result];
	},

	async boost(this: IExecuteFunctions, baseUrl: string, items: INodeExecutionData[], i: number) {
		const statusId = validateStatusId.call(this, i);
		const result = await handleApiRequest.call(
			this,
			'POST',
			`${baseUrl}/api/v1/statuses/${statusId}/reblog`,
		);
		return Array.isArray(result) ? result : [result || {}];
	},

	async unboost(this: IExecuteFunctions, baseUrl: string, items: INodeExecutionData[], i: number) {
		const statusId = validateStatusId.call(this, i);
		const result = await handleApiRequest.call(
			this,
			'POST',
			`${baseUrl}/api/v1/statuses/${statusId}/unreblog`,
		);
		return Array.isArray(result) ? result : [result || {}];
	},

	async bookmark(this: IExecuteFunctions, baseUrl: string, items: INodeExecutionData[], i: number) {
		const statusId = validateStatusId.call(this, i);
		const result = await handleApiRequest.call(
			this,
			'POST',
			`${baseUrl}/api/v1/statuses/${statusId}/bookmark`,
		);
		return Array.isArray(result) ? result : [result || {}];
	},

	async mediaUpload(
		this: IExecuteFunctions,
		baseUrl: string,
		items: INodeExecutionData[],
		i: number,
	) {
		const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
		const binaryData = items[i].binary;

		if (!binaryData?.[binaryPropertyName]) {
			throw new NodeOperationError(
				this.getNode(),
				`No binary data property "${binaryPropertyName}" exists on item!`,
				{ itemIndex: i },
			);
		}

		const maxSize = 40 * 1024 * 1024; // 40MB in bytes
		const data = binaryData[binaryPropertyName];
		if (data.data.length > maxSize) {
			throw new NodeOperationError(this.getNode(), "File size exceeds Mastodon's limit of 40MB", {
				itemIndex: i,
			});
		}

		const formData = {
			file: {
				value: Buffer.from(data.data, 'base64'),
				options: {
					filename: data.fileName || 'upload.bin',
					contentType: data.mimeType,
				},
			},
		};

		const result = await handleApiRequest.call(
			this,
			'POST',
			`${baseUrl}/api/v1/media`,
			{},
			{},
			{ formData },
		);
		return Array.isArray(result) ? result : [result || {}];
	},

	async scheduledStatuses(
		this: IExecuteFunctions,
		baseUrl: string,
		items: INodeExecutionData[],
		i: number,
	) {
		const result = await handleApiRequest.call(this, 'GET', `${baseUrl}/api/v1/scheduled_statuses`);
		return Array.isArray(result) ? result : [result || {}];
	},

	async search(this: IExecuteFunctions, baseUrl: string, items: INodeExecutionData[], i: number) {
		const query = this.getNodeParameter('query', i) as string;
		if (!query) {
			throw new NodeOperationError(this.getNode(), 'Search query is required');
		}

		const result = await handleApiRequest.call(
			this,
			'GET',
			`${baseUrl}/api/v2/search`,
			{},
			{ q: query, type: 'statuses' },
		);
		return Array.isArray(result) ? result : [result || {}];
	},

	async favourite(
		this: IExecuteFunctions,
		baseUrl: string,
		items: INodeExecutionData[],
		i: number,
	) {
		const statusId = validateStatusId.call(this, i);
		const result = await handleApiRequest.call(
			this,
			'POST',
			`${baseUrl}/api/v1/statuses/${statusId}/favourite`,
		);
		return Array.isArray(result) ? result : [result || {}];
	},

	async unfavourite(
		this: IExecuteFunctions,
		baseUrl: string,
		items: INodeExecutionData[],
		i: number,
	) {
		const statusId = validateStatusId.call(this, i);
		const result = await handleApiRequest.call(
			this,
			'POST',
			`${baseUrl}/api/v1/statuses/${statusId}/unfavourite`,
		);
		return Array.isArray(result) ? result : [result || {}];
	},

	async edit(this: IExecuteFunctions, baseUrl: string, items: INodeExecutionData[], i: number) {
		const statusId = validateStatusId.call(this, i);
		const status = validateStatusParam.call(this, i);
		const result = await handleApiRequest.call(
			this,
			'PUT',
			`${baseUrl}/api/v1/statuses/${statusId}`,
			{ status },
		);
		return Array.isArray(result) ? result : [result || {}];
	},

	async viewEditHistory(
		this: IExecuteFunctions,
		baseUrl: string,
		items: INodeExecutionData[],
		i: number,
	) {
		const statusId = validateStatusId.call(this, i);
		const result = await handleApiRequest.call(
			this,
			'GET',
			`${baseUrl}/api/v1/statuses/${statusId}/history`,
		);
		return Array.isArray(result) ? result : [result || {}];
	},

	async viewSource(
		this: IExecuteFunctions,
		baseUrl: string,
		items: INodeExecutionData[],
		i: number,
	) {
		const statusId = validateStatusId.call(this, i);
		const result = await handleApiRequest.call(
			this,
			'GET',
			`${baseUrl}/api/v1/statuses/${statusId}/source`,
		);
		return Array.isArray(result) ? result : [result || {}];
	},
};

export default methods;
