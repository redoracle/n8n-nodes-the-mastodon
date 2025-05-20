// Search-related interfaces for Mastodon node
import { IAccount } from '../account/AccountInterfaces';

export interface IHashtag {
	name: string;
	url: string;
	history: { day: string; uses: string; accounts: string }[];
}

export interface IStatus {
	id: string;
	uri: string;
	url: string;
	account: IAccount;
	content: string;
	created_at: string;
	// ... other status fields as needed
}

export interface ISearchResults {
	accounts: IAccount[];
	statuses: IStatus[];
	hashtags: IHashtag[];
}
