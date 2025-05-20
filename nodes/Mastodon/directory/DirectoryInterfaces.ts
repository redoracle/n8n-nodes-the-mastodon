// Directory-related interfaces for Mastodon node
import { IAccount } from '../account/AccountInterfaces';

export interface IDirectoryParams {
	limit?: number;
	offset?: number;
	order?: 'active' | 'new';
	local?: boolean;
	[key: string]: any;
}

export type IDirectory = IAccount[];
