// Mastodon Node for n8n
// Organized and optimized for maintainability and Mastodon API compliance
import {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeProperties,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
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
import { accountMethods, accountProperties } from './account';
import * as CanonicalEmailBlockMethods from './admin/canonical-email-blocks/CanonicalEmailBlockMethods';
import * as CohortMethods from './admin/cohorts/CohortMethods';
import * as DimensionMethods from './admin/dimensions/DimensionMethods';
import * as IpMethods from './admin/ips/IpMethods';
import { announcementMethods, announcementProperties } from './announcements';
import { appsMethods, appsProperties } from './apps/index';
import { authenticationMethods, authenticationProperties } from './authentication/index';
import { blocksMethods, blocksProperties } from './blocks';
import { bookmarksMethods, bookmarksProperties } from './bookmarks';
import { conversationMethods, conversationProperties } from './conversations';
import { customEmojisMethods, customEmojisProperties } from './customEmojis';
import { directoryMethods, directoryProperties } from './directory';
import { domainBlocksMethods, domainBlocksProperties } from './domainBlocks';
import { domainMethods, domainProperties } from './domains';
import { emailsMethods, emailsProperties } from './emails';
import { endorsementMethods, endorsementProperties } from './endorsements';
import { favouritesMethods, favouritesProperties } from './favourites';
import { featuredTagMethods, featuredTagProperties } from './featuredTags';
import { filterMethods, filterProperties } from './filters';
import { followedTagsMethods, followedTagsProperties } from './followedTags';
import { followRequestsMethods, followRequestsProperties } from './followRequests';
import { instanceMethods, instanceProperties } from './instance';
import { listMethods, listProperties } from './lists';
import { markerMethods, markerProperties } from './markers';
import {
	canonicalEmailBlockFields,
	canonicalEmailBlockOperations,
	cohortFields,
	cohortOperations,
	dimensionFields,
	dimensionOperations,
	ipFields,
	ipOperations,
	properties,
} from './Mastodon_Properties';
import { measureMethods, measureProperties } from './measures';
import { mediaMethods, mediaProperties } from './media';
import { mutesMethods, mutesProperties } from './mutes';
import { notificationMethods, notificationProperties } from './notifications';
import { oembedMethods, oembedProperties } from './oembed';
import { pollMethods, pollProperties } from './polls';
import { preferenceMethods, preferenceProperties } from './preferences';
import { profileMethods, profileProperties } from './profile';
import { proofMethods, proofProperties } from './proofs';
import { pushMethods, pushProperties } from './push';
import { reportMethods, reportProperties } from './reports';
import { retentionMethods, retentionProperties } from './retention';
import { scheduledStatusMethods, scheduledStatusProperties } from './scheduledStatuses';
import { searchMethods, searchProperties } from './search';
import { statusMethods, statusProperties } from './status';
import { streamingMethods, streamingProperties } from './streaming';
import { suggestionMethods, suggestionProperties } from './suggestions';
import { tagMethods, tagProperties } from './tags';
import { timelineMethods, timelineProperties } from './timeline';

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
				displayOptions: {
					show: {
						authType: ['oauth2'],
					},
				},
			},
			{
				name: 'mastodonTokenApi',
				required: true,
				displayOptions: {
					show: {
						authType: ['token'],
					},
				},
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			// Core Properties
			properties.url,
			properties.authType,
			properties.resources,

			// Modularized Components
			...statusProperties,
			...accountProperties,
			...announcementProperties,
			...appsProperties,
			...timelineProperties,
			...mediaProperties,
			...pollProperties,
			...bookmarksProperties,
			...conversationProperties,
			...customEmojisProperties,
			...directoryProperties,
			...endorsementProperties,
			...favouritesProperties,
			...mutesProperties,
			...blocksProperties,
			...domainBlocksProperties,
			...domainProperties,
			...filterProperties,
			...followRequestsProperties,
			...featuredTagProperties,
			...followedTagsProperties,
			...listProperties,
			...instanceProperties,
			...preferenceProperties,
			...markerProperties,
			...notificationProperties,
			...searchProperties,
			...suggestionProperties,
			...authenticationProperties,
			...scheduledStatusProperties,
			...tagProperties,
			...profileProperties,
			...pushProperties,
			...streamingProperties,
			...emailsProperties,
			...oembedProperties,
			...proofProperties,
			...reportProperties,
			...retentionProperties,
			...measureProperties,
			...canonicalEmailBlockOperations,
			...canonicalEmailBlockFields,
			...cohortOperations,
			...cohortFields,
			...dimensionOperations,
			...dimensionFields,
			...ipOperations,
			...ipFields,
		] as INodeProperties[],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		const authType = this.getNodeParameter('authType', 0) as string;

		let executionData: IDataObject | IDataObject[] | null = null;
		// Determine base URL: use credential baseUrl for auth, configured URL for API actions
		// Get credentials based on user-selected auth type
		let credentials;
		let credentialType: 'mastodonOAuth2Api' | 'mastodonTokenApi';

		if (authType === 'token') {
			try {
				credentials = await this.getCredentials('mastodonTokenApi');
				credentialType = 'mastodonTokenApi';
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : String(error);
				throw new NodeOperationError(
					this.getNode(),
					`No Mastodon Access Token credential selected. Please select a credential to authenticate. ${errorMessage}`,
					{ cause: error },
				);
			}
		} else {
			try {
				credentials = await this.getCredentials('mastodonOAuth2Api');
				credentialType = 'mastodonOAuth2Api';
			} catch (error) {
				const errorMessage = error instanceof Error ? error.message : String(error);
				throw new NodeOperationError(
					this.getNode(),
					`No Mastodon OAuth2 credential selected. Please select a credential to authenticate. ${errorMessage}`,
					{ cause: error },
				);
			}
		}

		if (resource === 'authentication' && credentialType !== 'mastodonOAuth2Api') {
			throw new NodeOperationError(
				this.getNode(),
				'Authentication operations require OAuth2 credentials. Please select OAuth2 as the Authentication Type.',
			);
		}

		// Normalize baseUrl by removing trailing slashes (consistent with credential test)
		const credentialBaseUrl = (credentials.baseUrl as string).replace(/\/+$/, '');
		const nodeBaseUrlParam = this.getNodeParameter('url', 0, '') as string;
		const nodeBaseUrl = nodeBaseUrlParam ? nodeBaseUrlParam.replace(/\/+$/, '') : credentialBaseUrl;
		const url = resource === 'authentication' ? credentialBaseUrl : nodeBaseUrl;

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

		const callMethod = async (
			methods: Record<string, (...args: unknown[]) => Promise<ExecutionResult | void>>,
			methodName: string,
			args: unknown[],
		): Promise<ExecutionResult> => {
			const fn = methods[methodName];

			// Runtime validation: ensure the method exists and is callable
			if (typeof fn !== 'function') {
				throw new NodeOperationError(
					this.getNode(),
					`Method "${methodName}" is not a valid function in the provided methods object. Available methods: ${Object.keys(methods).join(', ')}`,
				);
			}

			const result = await fn.call(this, ...args);

			// Handle void returns (e.g., DELETE operations) by normalizing to null
			if (result === undefined) {
				return null;
			}

			// Validate the result shape matches ExecutionResult
			if (result !== null && typeof result !== 'object') {
				throw new NodeOperationError(
					this.getNode(),
					`Method "${methodName}" returned an invalid result type. Expected IDataObject, IDataObject[], or null, but got ${typeof result}`,
				);
			}

			return result;
		};

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
						executionData = (await statusMethods[operation as keyof typeof statusMethods].call(
							this,
							url,
							items,
							i,
						)) as unknown as ExecutionResult;
						break;

					case 'account':
						if (!(operation in accountMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = (await accountMethods[operation as keyof typeof accountMethods].call(
							this,
							items,
							i,
						)) as unknown as ExecutionResult;
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
						executionData = (await bookmarksMethods[
							operation as keyof typeof bookmarksMethods
						].call(this, url, items, i)) as unknown as ExecutionResult;
						break;

					case 'favourites':
						if (!(operation in favouritesMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = (await favouritesMethods[
							operation as keyof typeof favouritesMethods
						].call(this, url, items, i)) as unknown as ExecutionResult;
						break;

					case 'mutes':
						if (!(operation in mutesMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = (await mutesMethods[operation as keyof typeof mutesMethods].call(
							this,
							url,
							items,
							i,
						)) as unknown as ExecutionResult;
						break;

					case 'blocks':
						if (!(operation in blocksMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = (await blocksMethods[operation as keyof typeof blocksMethods].call(
							this,
							url,
							items,
							i,
						)) as unknown as ExecutionResult;
						break;

					case 'domainBlocks':
						if (!(operation in domainBlocksMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = (await domainBlocksMethods[
							operation as keyof typeof domainBlocksMethods
						].call(this, url, items, i)) as unknown as ExecutionResult;
						break;

					case 'allowedDomains':
					case 'blockedDomains':
					case 'emailBlockedDomains':
						if (!(operation in domainMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = await callMethod(
							domainMethods as Record<
								string,
								(...args: unknown[]) => Promise<ExecutionResult | void>
							>,
							operation,
							[url, items, i],
						);
						break;

					case 'filters':
						if (!(operation in filterMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = (await filterMethods[operation as keyof typeof filterMethods].call(
							this,
							url,
							items,
							i,
						)) as unknown as ExecutionResult;
						break;

					case 'followRequests':
						if (!(operation in followRequestsMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = (await followRequestsMethods[
							operation as keyof typeof followRequestsMethods
						].call(this, url, items, i)) as unknown as ExecutionResult;
						break;

					case 'featuredTags':
						if (!(operation in featuredTagMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = (await featuredTagMethods[
							operation as keyof typeof featuredTagMethods
						].call(this, url, items, i)) as unknown as ExecutionResult;
						break;

					case 'preferences':
						if (!(operation in preferenceMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = (await preferenceMethods[
							operation as keyof typeof preferenceMethods
						].call(this, url, items, i)) as unknown as ExecutionResult;
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
						executionData = (await notificationMethods[
							operation as keyof typeof notificationMethods
						].call(this, url, items, i)) as unknown as ExecutionResult;
						break;

					case 'scheduledStatuses':
						if (!(operation in scheduledStatusMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = await callMethod(
							scheduledStatusMethods as Record<
								string,
								(...args: unknown[]) => Promise<ExecutionResult | void>
							>,
							operation,
							[url, items, i],
						);
						break;

					case 'tags':
						if (!(operation in tagMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = (await tagMethods[operation as keyof typeof tagMethods].call(
							this,
							url,
							i,
						)) as unknown as ExecutionResult;
						break;

					case 'profile':
						if (!(operation in profileMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = await callMethod(
							profileMethods as Record<
								string,
								(...args: unknown[]) => Promise<ExecutionResult | void>
							>,
							operation,
							[url],
						);
						break;

					case 'push':
						if (!(operation in pushMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = (await pushMethods[operation as keyof typeof pushMethods].call(
							this,
							url,
							items,
							i,
						)) as unknown as ExecutionResult;
						break;

					case 'streaming':
						if (!(operation in streamingMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = (await streamingMethods[
							operation as keyof typeof streamingMethods
						].call(this, url, items, i)) as unknown as ExecutionResult;
						break;

					case 'followedTags':
						if (!(operation in followedTagsMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = (await followedTagsMethods[
							operation as keyof typeof followedTagsMethods
						].call(this, url, items, i)) as unknown as ExecutionResult;
						break;

					case 'emails':
						if (!(operation in emailsMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = await callMethod(
							emailsMethods as Record<
								string,
								(...args: unknown[]) => Promise<ExecutionResult | void>
							>,
							operation,
							[url],
						);
						break;

					case 'canonicalEmailBlocks':
						if (!(operation in CanonicalEmailBlockMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = await callMethod(
							CanonicalEmailBlockMethods as Record<
								string,
								(...args: unknown[]) => Promise<ExecutionResult | void>
							>,
							operation,
							[url, items, i],
						);
						break;

					case 'cohorts':
						if (!(operation in CohortMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = await callMethod(
							CohortMethods as Record<
								string,
								(...args: unknown[]) => Promise<ExecutionResult | void>
							>,
							operation,
							[url, items, i],
						);
						break;

					case 'dimensions':
						if (!(operation in DimensionMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = await callMethod(
							DimensionMethods as Record<
								string,
								(...args: unknown[]) => Promise<ExecutionResult | void>
							>,
							operation,
							[url, items, i],
						);
						break;

					case 'ips':
						if (!(operation in IpMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = await callMethod(
							IpMethods as Record<string, (...args: unknown[]) => Promise<ExecutionResult | void>>,
							operation,
							[url, items, i],
						);
						break;
					case 'apps':
						if (!(operation in appsMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = (await appsMethods[operation as keyof typeof appsMethods].call(
							this,
							url,
							items,
							i,
						)) as unknown as ExecutionResult;
						break;

					case 'measures':
						if (!(operation in measureMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = (await measureMethods[operation as keyof typeof measureMethods].call(
							this,
							url,
							items,
							i,
						)) as unknown as ExecutionResult;
						break;

					case 'reports':
						if (!(operation in reportMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = (await reportMethods[operation as keyof typeof reportMethods].call(
							this,
							url,
							items,
							i,
						)) as unknown as ExecutionResult;
						break;

					case 'retention':
						if (!(operation in retentionMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = (await retentionMethods[
							operation as keyof typeof retentionMethods
						].call(this, url, items, i)) as unknown as ExecutionResult;
						break;

					case 'proofs':
						if (!(operation in proofMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = (await proofMethods[operation as keyof typeof proofMethods].call(
							this,
							url,
							items,
							i,
						)) as unknown as ExecutionResult;
						break;

					case 'oembed':
						if (!(operation in oembedMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = (await oembedMethods[operation as keyof typeof oembedMethods].call(
							this,
							url,
							items,
							i,
						)) as unknown as ExecutionResult;
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

					case 'customEmojis':
						if (!(operation in customEmojisMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = (await customEmojisMethods[
							operation as keyof typeof customEmojisMethods
						].call(this, url, items, i)) as unknown as ExecutionResult;
						break;

					case 'directory':
						if (!(operation in directoryMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = (await directoryMethods[
							operation as keyof typeof directoryMethods
						].call(this, url, items, i)) as unknown as ExecutionResult;
						break;

					case 'announcements':
						if (!(operation in announcementMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = (await announcementMethods[
							operation as keyof typeof announcementMethods
						].call(this, url, items, i)) as unknown as ExecutionResult;
						break;

					case 'endorsements':
						if (!(operation in endorsementMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = (await endorsementMethods[
							operation as keyof typeof endorsementMethods
						].call(this, url, items, i)) as unknown as ExecutionResult;
						break;

					case 'conversations':
						if (!(operation in conversationMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = (await conversationMethods[
							operation as keyof typeof conversationMethods
						].call(this, url, items, i)) as unknown as ExecutionResult;
						break;

					case 'search':
						if (!(operation in searchMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = (await searchMethods[operation as keyof typeof searchMethods].call(
							this,
							url,
							items,
							i,
						)) as unknown as ExecutionResult;
						break;

					case 'suggestions':
						if (!(operation in suggestionMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = (await suggestionMethods[
							operation as keyof typeof suggestionMethods
						].call(this, url, items, i)) as unknown as ExecutionResult;
						break;

					case 'instance':
						if (!(operation in instanceMethods)) {
							throw new Error(
								`The operation "${operation}" for resource "${resource}" is not implemented!`,
							);
						}
						executionData = (await instanceMethods[operation as keyof typeof instanceMethods].call(
							this,
							url,
							items,
							i,
						)) as unknown as ExecutionResult;
						break;

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

// Mastodon class already exported above; no additional export declaration needed.
