// Mastodon Properties for n8n Node
// Organized, grouped, and documented for maintainability and Mastodon API compliance
import { INodeProperties } from 'n8n-workflow';

// Import modularized properties
import { accountFields, accountOperations } from './account/AccountProperties';
import {
    canonicalEmailBlockFields,
    canonicalEmailBlockOperations,
} from './admin/canonical-email-blocks/CanonicalEmailBlockProperties';
import { cohortFields, cohortOperations } from './admin/cohorts/CohortProperties';
import { dimensionFields, dimensionOperations } from './admin/dimensions/DimensionProperties';
import { announcementFields, announcementOperations } from './announcements/AnnouncementProperties';
import { appsFields, appsOperations } from './apps/AppsProperties';
import {
    authenticationFields,
    authenticationOperations,
} from './authentication/AuthenticationProperties';
import { blocksFields, blocksOperations } from './blocks/BlocksProperties';
import { bookmarksFields, bookmarksOperations } from './bookmarks/BookmarksProperties';
import { directoryFields, directoryOperations } from './directory/DirectoryProperties';
import { domainBlocksFields, domainBlocksOperations } from './domainBlocks/DomainBlocksProperties';
import {
    allowedDomainFields,
    allowedDomainOperations,
} from './domains/allowed/AllowedDomainProperties';
import {
    emailBlockedDomainFields,
    emailBlockedDomainOperations,
} from './domains/email-blocked/EmailBlockedDomainProperties';
import { favouritesFields, favouritesOperations } from './favourites/FavouritesProperties';
import { featuredTagFields, featuredTagOperations } from './featuredTags/FeaturedTagProperties';
import { filtersFields, filtersOperations } from './filters/FiltersProperties';
import {
    followRequestFields,
    followRequestOperations,
} from './followRequests/FollowRequestProperties';
import { listFields, listOperations } from './lists/ListProperties';
import { mediaFields, mediaOperations } from './media/MediaProperties';
import { mutesFields, mutesOperations } from './mutes/MutesProperties';
import { notificationFields, notificationOperations } from './notifications/NotificationProperties';
import { pollFields, pollOperations } from './polls/PollProperties';
import { preferenceFields, preferenceOperations } from './preferences/PreferenceProperties';
import { pushFields, pushOperations } from './push/PushProperties';
import { searchFields, searchOperations } from './search/SearchProperties';
import { streamingFields, streamingOperations } from './streaming/StreamingProperties';
import { timelineFields, timelineOperations } from './timeline/TimelineProperties';

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
			{ name: 'Announcements', value: 'announcements' },
			{ name: 'Authentication', value: 'authentication' },
			{ name: 'Blocks', value: 'blocks' },
			{ name: 'Bookmarks', value: 'bookmarks' },
			{ name: 'Conversations', value: 'conversations' },
			{ name: 'Custom Emojis', value: 'customEmojis' },
			{ name: 'Directory', value: 'directory' },
			{ name: 'Endorsements', value: 'endorsements' },
			{ name: 'Featured Tags', value: 'featuredTags' },
			{ name: 'Filters', value: 'filters' },
			{ name: 'Follow Requests', value: 'followRequests' },
			{ name: 'Favourites', value: 'favourites' },
			{ name: 'Instance', value: 'instance' },
			{ name: 'Lists', value: 'lists' },
			{ name: 'Media', value: 'media' },
			{ name: 'Mutes', value: 'mutes' },
			{ name: 'Notifications', value: 'notifications' },
			{ name: 'Polls', value: 'polls' },
			{ name: 'Search', value: 'search' },
			{ name: 'Status', value: 'status' },
			{ name: 'Suggestions', value: 'suggestions' },
			{ name: 'Timeline', value: 'timeline' },
		].sort((a, b) => a.name.localeCompare(b.name)),
		default: 'status',
	} as INodeProperties,
};

// Export the modularized properties
export {
    accountFields, accountOperations, allowedDomainFields, allowedDomainOperations, announcementFields, announcementOperations, appsFields, appsOperations, authenticationFields, authenticationOperations, blocksFields, blocksOperations, bookmarksFields, bookmarksOperations, canonicalEmailBlockFields, canonicalEmailBlockOperations, cohortFields, cohortOperations, dimensionFields, dimensionOperations, directoryFields, directoryOperations, domainBlocksFields, domainBlocksOperations, emailBlockedDomainFields, emailBlockedDomainOperations, favouritesFields, favouritesOperations, featuredTagFields, featuredTagOperations, filtersFields, filtersOperations, followRequestFields, followRequestOperations, listFields, listOperations, mediaFields, mediaOperations, mutesFields, mutesOperations, notificationFields, notificationOperations, pollFields, pollOperations, preferenceFields, preferenceOperations, pushFields, pushOperations, searchFields, searchOperations, streamingFields, streamingOperations, timelineFields, timelineOperations
};

