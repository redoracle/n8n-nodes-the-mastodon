// Aggregated bookmarks module for Mastodon node
import { INodeProperties } from 'n8n-workflow';
import * as Props from './BookmarksProperties';
import * as Methods from './BookmarksMethods';

export const bookmarksProperties: INodeProperties[] = [
	Props.bookmarksOperations as INodeProperties,
	...Props.bookmarksFields,
];

export const bookmarksMethods = {
	getBookmarks: Methods.getBookmarks,
	addBookmark: Methods.addBookmark,
	removeBookmark: Methods.removeBookmark,
};
