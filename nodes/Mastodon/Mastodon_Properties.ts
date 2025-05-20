// Mastodon Properties for n8n Node
// Organized, grouped, and documented for maintainability and Mastodon API compliance
import { INodeProperties } from 'n8n-workflow';

// Import modularized properties
import { accountOperations, accountFields } from './account/AccountProperties';
import {
	authenticationOperations,
	authenticationFields,
} from './authentication/AuthenticationProperties';
import { appsOperations, appsFields } from './apps/AppsProperties';
import { bookmarksOperations, bookmarksFields } from './bookmarks/BookmarksProperties';
import { favouritesOperations, favouritesFields } from './favourites/FavouritesProperties';
import { mutesOperations, mutesFields } from './mutes/MutesProperties';
import { blocksOperations, blocksFields } from './blocks/BlocksProperties';
import { domainBlocksOperations, domainBlocksFields } from './domainBlocks/DomainBlocksProperties';
import { filtersOperations, filtersFields } from './filters/FiltersProperties';
import {
	followRequestOperations,
	followRequestFields,
} from './followRequests/FollowRequestProperties';
import { featuredTagOperations, featuredTagFields } from './featuredTags/FeaturedTagProperties';
import { preferenceOperations, preferenceFields } from './preferences/PreferenceProperties';
import { timelineOperations, timelineFields } from './timeline/TimelineProperties';
import { mediaOperations, mediaFields } from './media/MediaProperties';
import { pollOperations, pollFields } from './polls/PollProperties';
import { listOperations, listFields } from './lists/ListProperties';
import { searchOperations, searchFields } from './search/SearchProperties';
import { pushOperations, pushFields } from './push/PushProperties';
import { streamingOperations, streamingFields } from './streaming/StreamingProperties';
import { directoryOperations, directoryFields } from './directory/DirectoryProperties';
import { notificationOperations, notificationFields } from './notifications/NotificationProperties';
import { announcementOperations, announcementFields } from './announcements/AnnouncementProperties';
import {
	emailBlockedDomainOperations,
	emailBlockedDomainFields,
} from './domains/email-blocked/EmailBlockedDomainProperties';
import {
	allowedDomainOperations,
	allowedDomainFields,
} from './domains/allowed/AllowedDomainProperties';
import { cohortOperations, cohortFields } from './admin/cohorts/CohortProperties';
import { dimensionOperations, dimensionFields } from './admin/dimensions/DimensionProperties';
import {
	canonicalEmailBlockOperations,
	canonicalEmailBlockFields,
} from './admin/canonical-email-blocks/CanonicalEmailBlockProperties';

// Core connection property
export const properties = {
	url: {
		displayName: 'Mastodon URL',
		name: 'url',
		type: 'string',
		default: 'https://mastodon.social',
		placeholder: 'https://mastodon.social',
		required: true,
		description: 'URL of the Mastodon instance to connect to',
	} as INodeProperties,
	resources: {
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{ name: 'Account', value: 'account' },
			{ name: 'Authentication', value: 'authentication' },
			{ name: 'Blocks', value: 'blocks' },
			{ name: 'Bookmarks', value: 'bookmarks' },
			{ name: 'Conversations', value: 'conversations' },
			{ name: 'Custom Emojis', value: 'customEmojis' },
			{ name: 'Directory', value: 'directory' },
			{ name: 'Endorsements', value: 'endorsements' },
			{ name: 'Featured Tags', value: 'featuredTags' },
			{ name: 'Follow Requests', value: 'followRequests' },
			{ name: 'Favourites', value: 'favourites' },
			{ name: 'Lists', value: 'lists' },
			{ name: 'Media', value: 'media' },
			{ name: 'Mutes', value: 'mutes' },
			{ name: 'Notifications', value: 'notifications' },
			{ name: 'Polls', value: 'polls' },
			{ name: 'Status', value: 'status' },
			{ name: 'Timeline', value: 'timeline' },
		].sort((a, b) => a.name.localeCompare(b.name)),
		default: 'status',
	} as INodeProperties,
};

// Export the modularized properties
export {
	accountOperations,
	accountFields,
	authenticationOperations,
	authenticationFields,
	appsOperations,
	appsFields,
	bookmarksOperations,
	bookmarksFields,
	favouritesOperations,
	favouritesFields,
	mutesOperations,
	mutesFields,
	blocksOperations,
	blocksFields,
	domainBlocksOperations,
	domainBlocksFields,
	filtersOperations,
	filtersFields,
	followRequestOperations,
	followRequestFields,
	featuredTagOperations,
	featuredTagFields,
	preferenceOperations,
	preferenceFields,
	timelineOperations,
	timelineFields,
	mediaOperations,
	mediaFields,
	pollOperations,
	pollFields,
	listOperations,
	listFields,
	searchOperations,
	searchFields,
	pushOperations,
	pushFields,
	streamingOperations,
	streamingFields,
	directoryOperations,
	directoryFields,
	notificationOperations,
	notificationFields,
	announcementOperations,
	announcementFields,
	emailBlockedDomainOperations,
	emailBlockedDomainFields,
	allowedDomainOperations,
	allowedDomainFields,
	cohortOperations,
	cohortFields,
	dimensionOperations,
	dimensionFields,
	canonicalEmailBlockOperations,
	canonicalEmailBlockFields,
};
