import crypto from 'crypto';
import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	NodeOperationError,
} from 'n8n-workflow';
import { bindHandleApiRequest, ValidationUtils } from '../Mastodon_Methods';
import { IStatusMethods } from './StatusMethodsTypes';

function validateStatusParam(this: IExecuteFunctions, i: number): string {
	const status = this.getNodeParameter('status', i);
	if (!status) {
		throw new NodeOperationError(this.getNode(), 'Status text is required');
	}
	return ValidationUtils.truncateWithUrlPreservation(
		status as string,
		ValidationUtils.MASTODON_MAX_STATUS_LENGTH,
	);
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
			const vis = ValidationUtils.sanitizeStringParam(additionalFields.visibility as string);
			const allowedVisibilities = ['direct', 'private', 'unlisted', 'public'];
			if (!allowedVisibilities.includes(vis)) {
				throw new NodeOperationError(
					this.getNode(),
					`Invalid visibility value "${vis}". Allowed values: ${allowedVisibilities.join(', ')}`,
				);
			}
			body.visibility = vis;
		}

		// Scheduled posting
		if (additionalFields.scheduledAt) {
			const scheduledAtStr = additionalFields.scheduledAt as string;
			const scheduledDate = new Date(scheduledAtStr);
			if (isNaN(scheduledDate.getTime())) {
				throw new NodeOperationError(this.getNode(), 'Scheduled time is not a valid date');
			}
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
		const idempotencyKey = crypto
			.createHash('sha256')
			.update(JSON.stringify({ status, additionalFields }))
			.digest('hex');

		// Make API request with idempotency key
		const apiRequest = bindHandleApiRequest(this);
		const result = await apiRequest(
			'POST',
			`${baseUrl}/api/v1/statuses`,
			body,
			{},
			{ headers: { 'Idempotency-Key': idempotencyKey } },
		);
		return Array.isArray(result) ? result : [result || {}];
	},

	async view(this: IExecuteFunctions, baseUrl: string, items: INodeExecutionData[], i: number) {
		const statusId = validateStatusId.call(this, i);
		let result;
		try {
			const apiRequest = bindHandleApiRequest(this);
			result = await apiRequest('GET', `${baseUrl}/api/v1/statuses/${statusId}`);
		} catch (error) {
			// Always output something meaningful for n8n UI
			return [{ error: error.message || 'Failed to fetch status', statusId }];
		}
		if (!result) {
			return [{ error: 'No data returned from API', statusId }];
		}
		// Always wrap in array and ensure it's an object
		return Array.isArray(result)
			? result.map((r) => (typeof r === 'object' ? r : { value: r }))
			: [typeof result === 'object' ? result : { value: result }];
	},

	async delete(this: IExecuteFunctions, baseUrl: string, items: INodeExecutionData[], i: number) {
		const statusId = validateStatusId.call(this, i);
		const apiRequest = bindHandleApiRequest(this);
		const result = await apiRequest('DELETE', `${baseUrl}/api/v1/statuses/${statusId}`);
		return Array.isArray(result) ? result : [result];
	},

	async boost(this: IExecuteFunctions, baseUrl: string, items: INodeExecutionData[], i: number) {
		const statusId = validateStatusId.call(this, i);
		const apiRequest = bindHandleApiRequest(this);
		const result = await apiRequest('POST', `${baseUrl}/api/v1/statuses/${statusId}/reblog`);
		return Array.isArray(result) ? result : [result || {}];
	},

	async unboost(this: IExecuteFunctions, baseUrl: string, items: INodeExecutionData[], i: number) {
		const statusId = validateStatusId.call(this, i);
		const apiRequest = bindHandleApiRequest(this);
		const result = await apiRequest('POST', `${baseUrl}/api/v1/statuses/${statusId}/unreblog`);
		return Array.isArray(result) ? result : [result || {}];
	},

	async bookmark(this: IExecuteFunctions, baseUrl: string, items: INodeExecutionData[], i: number) {
		const statusId = validateStatusId.call(this, i);
		const apiRequest = bindHandleApiRequest(this);
		const result = await apiRequest('POST', `${baseUrl}/api/v1/statuses/${statusId}/bookmark`);
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

		const apiRequest = bindHandleApiRequest(this);
		const result = await apiRequest('POST', `${baseUrl}/api/v1/media`, {}, {}, { formData });
		return Array.isArray(result) ? result : [result || {}];
	},

	async scheduledStatuses(
		this: IExecuteFunctions,
		baseUrl: string,
		items: INodeExecutionData[],
		i: number,
	) {
		const apiRequest = bindHandleApiRequest(this);
		const result = await apiRequest('GET', `${baseUrl}/api/v1/scheduled_statuses`);
		return Array.isArray(result) ? result : [result || {}];
	},

	async search(this: IExecuteFunctions, baseUrl: string, items: INodeExecutionData[], i: number) {
		const query = this.getNodeParameter('query', i) as string;
		if (!query) {
			throw new NodeOperationError(this.getNode(), 'Search query is required');
		}

		const apiRequest = bindHandleApiRequest(this);
		const result = await apiRequest(
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
		const apiRequest = bindHandleApiRequest(this);
		const result = await apiRequest('POST', `${baseUrl}/api/v1/statuses/${statusId}/favourite`);
		return Array.isArray(result) ? result : [result || {}];
	},

	async unfavourite(
		this: IExecuteFunctions,
		baseUrl: string,
		items: INodeExecutionData[],
		i: number,
	) {
		const statusId = validateStatusId.call(this, i);
		const apiRequest = bindHandleApiRequest(this);
		const result = await apiRequest('POST', `${baseUrl}/api/v1/statuses/${statusId}/unfavourite`);
		return Array.isArray(result) ? result : [result || {}];
	},

	async edit(this: IExecuteFunctions, baseUrl: string, items: INodeExecutionData[], i: number) {
		const statusId = validateStatusId.call(this, i);
		const status = validateStatusParam.call(this, i);
		const apiRequest = bindHandleApiRequest(this);
		const result = await apiRequest('PUT', `${baseUrl}/api/v1/statuses/${statusId}`, { status });
		return Array.isArray(result) ? result : [result || {}];
	},

	async viewEditHistory(
		this: IExecuteFunctions,
		baseUrl: string,
		items: INodeExecutionData[],
		i: number,
	) {
		const statusId = validateStatusId.call(this, i);
		const apiRequest = bindHandleApiRequest(this);
		const result = await apiRequest('GET', `${baseUrl}/api/v1/statuses/${statusId}/history`);
		return Array.isArray(result) ? result : [result || {}];
	},

	/**
	 * Get status context (ancestors and descendants)
	 * GET /api/v1/statuses/:id/context
	 * Fully compliant with Mastodon API specifications:
	 * - Supports authenticated and unauthenticated requests
	 * - Handles private statuses with proper scope (read:statuses)
	 * - Respects depth limits (40/60 unauthenticated, 4096 authenticated)
	 * - Provides multiple return formats for different use cases
	 */
	async context(this: IExecuteFunctions, baseUrl: string, items: INodeExecutionData[], i: number) {
		const statusId = validateStatusId.call(this, i);
		const additionalOptions = this.getNodeParameter('additionalOptions', i) as IDataObject;
		const returnFormat = additionalOptions.returnFormat || 'structured';

		// Make API request to get context
		const apiRequest = bindHandleApiRequest(this);
		const contextResult = await apiRequest('GET', `${baseUrl}/api/v1/statuses/${statusId}/context`);

		if (!contextResult) {
			return [
				{
					ancestors: [],
					descendants: [],
					metadata: {
						ancestorCount: 0,
						descendantCount: 0,
						totalStatuses: 0,
						targetStatusId: statusId,
						error: 'No context result received',
					},
				},
			];
		}

		const { ancestors = [], descendants = [] } = contextResult as {
			ancestors: IDataObject[];
			descendants: IDataObject[];
		};

		// Process based on return format
		switch (returnFormat) {
			case 'flat':
				// Return chronologically ordered flat array
				const allStatuses = [...ancestors, ...descendants].sort((a, b) => {
					const dateA = new Date(a.created_at as string).getTime();
					const dateB = new Date(b.created_at as string).getTime();
					return dateA - dateB;
				});
				return allStatuses;

			case 'tree':
				// Build nested tree structure using in_reply_to_id relationships
				const threadTree = buildThreadTree([...ancestors, ...descendants]);
				return [
					{
						thread: threadTree,
						metadata: { totalStatuses: ancestors.length + descendants.length },
					},
				];

			case 'structured':
			default:
				// Return structured ancestors/descendants format
				return [
					{
						ancestors,
						descendants,
						metadata: {
							ancestorCount: ancestors.length,
							descendantCount: descendants.length,
							totalStatuses: ancestors.length + descendants.length,
							targetStatusId: statusId,
						},
					},
				];
		}
	},

	/**
	 * Get status source (raw Markdown/text)
	 * GET /api/v1/statuses/:id/source
	 */
	async viewSource(
		this: IExecuteFunctions,
		baseUrl: string,
		items: INodeExecutionData[],
		i: number,
	) {
		const statusId = validateStatusId.call(this, i);
		const apiRequest = bindHandleApiRequest(this);
		const result = await apiRequest('GET', `${baseUrl}/api/v1/statuses/${statusId}/source`);
		return Array.isArray(result) ? result : [result || {}];
	},
};

/**
 * Helper function to build a threaded tree structure from flat status array
 */
function buildThreadTree(statuses: IDataObject[]): IDataObject {
	const statusMap = new Map<string, IDataObject>();
	const rootStatuses: IDataObject[] = [];

	// First pass: create map and initialize replies arrays
	statuses.forEach((status) => {
		statusMap.set(status.id as string, { ...status, replies: [] });
	});

	// Second pass: build tree structure
	statuses.forEach((status) => {
		const statusWithReplies = statusMap.get(status.id as string)!;
		const parentId = status.in_reply_to_id as string;

		if (parentId && statusMap.has(parentId)) {
			// Add to parent's replies
			const parent = statusMap.get(parentId)!;
			(parent.replies as IDataObject[]).push(statusWithReplies);
		} else {
			// Root level status
			rootStatuses.push(statusWithReplies);
		}
	});

	// Sort by creation date at each level
	const sortReplies = (status: IDataObject) => {
		const replies = status.replies as IDataObject[];
		replies.sort((a, b) => {
			const dateA = new Date(a.created_at as string).getTime();
			const dateB = new Date(b.created_at as string).getTime();
			return dateA - dateB;
		});
		replies.forEach(sortReplies);
	};

	rootStatuses.forEach(sortReplies);
	rootStatuses.sort((a, b) => {
		const dateA = new Date(a.created_at as string).getTime();
		const dateB = new Date(b.created_at as string).getTime();
		return dateA - dateB;
	});

	return {
		thread: rootStatuses,
		structure: 'tree',
	};
}

export { methods };
