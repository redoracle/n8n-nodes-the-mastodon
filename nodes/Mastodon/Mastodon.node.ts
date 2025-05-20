// Mastodon Node for n8n
// Organized and optimized for maintainability and Mastodon API compliance
import {
	INodeType,
	INodeTypeDescription,
	IExecuteFunctions,
	INodeExecutionData,
	NodeOperationError,
	INodeProperties,
	IDataObject,
} from 'n8n-workflow';

// Define core interfaces
interface IOAuthServerConfig extends IDataObject {
	issuer: string;
	authorization_endpoint: string;
	token_endpoint: string;
	scopes_supported: string[];
	response_types_supported: string[];
	code_challenge_methods_supported: string[];
	grant_types_supported: string[];
}

interface ITimeline extends IDataObject {
	id: string;
	content: string;
	created_at: string;
}

interface IMediaAttachment extends IDataObject {
	id: string;
	type: string;
	url: string;
	preview_url: string;
	remote_url: string | null;
	meta: IDataObject;
	description: string | null;
	blurhash: string;
}

interface IPoll extends IDataObject {
	id: string;
	expires_at: string | null;
	expired: boolean;
	multiple: boolean;
	votes_count: number;
	options: IDataObject[];
}

interface IMarkerResponse extends IDataObject {
	home?: {
		last_read_id: string;
		version: number;
		updated_at: string;
	};
	notifications?: {
		last_read_id: string;
		version: number;
		updated_at: string;
	};
}

// Define type for execution data
type ExecutionResult = IDataObject | IDataObject[] | null;

// Import modularized components
import { properties } from './Mastodon_Properties';
import { statusProperties, statusMethods } from './status';
import { accountProperties, accountMethods } from './account';
import { timelineProperties, timelineMethods } from './timeline';
import { mediaProperties, mediaMethods } from './media';
import { pollProperties, pollMethods } from './polls';
import { bookmarksProperties, bookmarksMethods } from './bookmarks';
import { favouritesProperties, favouritesMethods } from './favourites';
import { mutesProperties, mutesMethods } from './mutes';
import { blocksProperties, blocksMethods } from './blocks';
import { domainBlocksProperties, domainBlocksMethods } from './domainBlocks';
import { filterProperties, filterMethods } from './filters';
import { followRequestsProperties, followRequestsMethods } from './followRequests';
import { featuredTagProperties, featuredTagMethods } from './featuredTags';
import { preferenceProperties, preferenceMethods } from './preferences';
import { measureProperties, measureMethods } from './measures';
import { reportProperties, reportMethods } from './reports';
import { retentionProperties, retentionMethods } from './retention';
import { proofProperties, proofMethods } from './proofs';
import { oembedProperties, oembedMethods } from './oembed';
import { markerProperties, markerMethods } from './markers';
import { notificationProperties, notificationMethods } from './notifications';
import { authenticationProperties, authenticationMethods } from './authentication/index';
import { appsProperties, appsMethods } from './apps/index';
import { listMethods } from './lists';

export class Mastodon implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Mastodon',
		name: 'mastodon',
		icon: 'file:Mastodon.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Mastodon API',
		defaults: {
			name: 'Mastodon',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'mastodonOAuth2Api',
				required: true,
			},
		],
		properties: [
			// Core Properties
			properties.url,
			properties.resources,

			// Modularized Components
			...statusProperties,
			...accountProperties,
			...timelineProperties,
			...mediaProperties,
			...pollProperties,
			...bookmarksProperties,
			...favouritesProperties,
			...mutesProperties,
			...blocksProperties,
			...domainBlocksProperties,
			...filterProperties,
			...followRequestsProperties,
			...featuredTagProperties,
			...preferenceProperties,
			...markerProperties,
			...notificationProperties,
			...authenticationProperties,
			...appsProperties,

			// Admin & Special Features
			...measureProperties,
			...reportProperties,
			...retentionProperties,
			...proofProperties,
			...oembedProperties,
		] as INodeProperties[],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		let executionData: IDataObject | IDataObject[] | null = null;
		const url = (await this.getCredentials('mastodonOAuth2Api')).baseUrl as string;

		// Handle authentication operations
		if (resource === 'authentication') {
			try {
				if (operation === 'discoverOAuthConfig') {
					executionData = await authenticationMethods.discoverOAuthConfig.call(this, url);
					if (executionData === null) {
						executionData = {};
					}
				} else {
					// Only cast to IDataObject for non-discoverOAuthConfig
					const result = await (
						authenticationMethods[operation as keyof typeof authenticationMethods] as (
							this: IExecuteFunctions,
							baseUrl: string,
							items: INodeExecutionData[],
							i: number,
						) => Promise<IDataObject>
					).call(this, url, items, 0);
					executionData = result;
				}

				returnData.push({
					json: executionData || {},
				});
				return [returnData];
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: error.message } });
					return [returnData];
				}
				throw error;
			}
		}

		try {
			for (let i = 0; i < items.length; i++) {
				// Route to appropriate modular method based on resource
				switch (resource) {
					case 'status':
						if (!(operation in statusMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = await statusMethods[operation as keyof typeof statusMethods].call(
							this,
							url,
							items,
							i,
						);
						break;

					case 'account':
						if (!(operation in accountMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = await (
							accountMethods[operation as keyof typeof accountMethods] as any
						).call(this, items, i);
						break;

					case 'timeline':
						if (!(operation in timelineMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						// Handle timeline operations and push results directly
						const timelineResult = await timelineMethods[
							operation as keyof typeof timelineMethods
						].call(this, url, items, i);
						let timelineItems: INodeExecutionData[];
						if (Array.isArray(timelineResult)) {
							// Map each item to INodeExecutionData
							timelineItems = timelineResult.map((item) => ({
								json: item as unknown as IDataObject,
							}));
						} else {
							timelineItems = [{ json: timelineResult }];
						}
						// Add to return data and continue to next iteration
						returnData.push(...timelineItems);
						continue;

					case 'media':
						if (!(operation in mediaMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						const mediaResult = await mediaMethods[operation as keyof typeof mediaMethods].call(
							this,
							url,
							items,
							i,
						);
						executionData = mediaResult as unknown as IDataObject;
						break;

					case 'polls':
						if (!(operation in pollMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						const pollResult = await pollMethods[operation as keyof typeof pollMethods].call(
							this,
							url,
							items,
							i,
						);
						executionData = pollResult as unknown as IDataObject;
						break;

					case 'bookmarks':
						if (!(operation in bookmarksMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = await bookmarksMethods[operation as keyof typeof bookmarksMethods].call(
							this,
							url,
							items,
							i,
						);
						break;

					case 'favourites':
						if (!(operation in favouritesMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = await favouritesMethods[
							operation as keyof typeof favouritesMethods
						].call(this, url, items, i);
						break;

					case 'mutes':
						if (!(operation in mutesMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = await mutesMethods[operation as keyof typeof mutesMethods].call(
							this,
							url,
							items,
							i,
						);
						break;

					case 'blocks':
						if (!(operation in blocksMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = await blocksMethods[operation as keyof typeof blocksMethods].call(
							this,
							url,
							items,
							i,
						);
						break;

					case 'domainBlocks':
						if (!(operation in domainBlocksMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = await domainBlocksMethods[
							operation as keyof typeof domainBlocksMethods
						].call(this, url, items, i);
						break;

					case 'filters':
						if (!(operation in filterMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = await filterMethods[operation as keyof typeof filterMethods].call(
							this,
							url,
							items,
							i,
						);
						break;

					case 'followRequests':
						if (!(operation in followRequestsMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = await (
							followRequestsMethods[operation as keyof typeof followRequestsMethods] as any
						).call(this, url, items, i);
						break;

					case 'featuredTags':
						if (!(operation in featuredTagMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = await featuredTagMethods[
							operation as keyof typeof featuredTagMethods
						].call(this, url, items, i);
						break;

					case 'preferences':
						if (!(operation in preferenceMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = await preferenceMethods[
							operation as keyof typeof preferenceMethods
						].call(this, url, items, i);
						break;

					case 'markers':
						if (!(operation in markerMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						const markerResult = await markerMethods[operation as keyof typeof markerMethods].call(
							this,
							url,
							items,
							i,
						);
						executionData = markerResult as IDataObject;
						break;

					case 'notifications':
						if (!(operation in notificationMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = await notificationMethods[
							operation as keyof typeof notificationMethods
						].call(this, url, items, i);
						break;

					case 'apps':
						if (!(operation in appsMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = await appsMethods[operation as keyof typeof appsMethods].call(
							this,
							url,
							items,
							i,
						);
						break;

					case 'authentication':
						if (!(operation in authenticationMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						const authResult = await (
							authenticationMethods[operation as keyof typeof authenticationMethods] as (
								this: IExecuteFunctions,
								baseUrl: string,
								items: INodeExecutionData[],
								i: number,
							) => Promise<IDataObject>
						).call(this, url, items, i);
						executionData = authResult;
						break;

					case 'measures':
						if (!(operation in measureMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = await measureMethods[operation as keyof typeof measureMethods].call(
							this,
							url,
							items,
							i,
						);
						break;

					case 'reports':
						if (!(operation in reportMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = await reportMethods[operation as keyof typeof reportMethods].call(
							this,
							url,
							items,
							i,
						);
						break;

					case 'retention':
						if (!(operation in retentionMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = await retentionMethods[operation as keyof typeof retentionMethods].call(
							this,
							url,
						);
						break;

					case 'proofs':
						if (!(operation in proofMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = await proofMethods[operation as keyof typeof proofMethods].call(
							this,
							url,
						);
						break;

					case 'oembed':
						if (!(operation in oembedMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = await oembedMethods[operation as keyof typeof oembedMethods].call(
							this,
							url,
							items,
							i,
						);
						break;

					case 'lists':
						if (!(operation in listMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						// Handle lists operations and push results directly
						const listsResult = await listMethods[operation as keyof typeof listMethods].call(
							this,
							url,
							items,
							i,
						);
						let listsItems: INodeExecutionData[];
						if (Array.isArray(listsResult)) {
							listsItems = listsResult.map((item) => ({ json: item }));
						} else {
							listsItems = [{ json: listsResult }];
						}
						returnData.push(...listsItems);
						continue;

					default:
						throw new Error(`The resource "${resource}" is not known!`);
				}

				if (Array.isArray(executionData)) {
					returnData.push(...executionData.map((data) => ({ json: data || {} })));
				} else if (executionData !== undefined && executionData !== null) {
					returnData.push({ json: executionData });
				}
			}

			return [returnData];
		} catch (error) {
			if (this.continueOnFail()) {
				return [returnData];
			}
			throw error;
		}
	}
}

export default Mastodon;
