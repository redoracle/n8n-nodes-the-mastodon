// Account-related interfaces for Mastodon node
import { Role } from './RoleInterface';

export interface IAccount {
	id: string;
	username: string;
	acct: string;
	display_name: string;
	note: string;
	url: string;
	avatar: string;
	header: string;
	locked: boolean;
	bot: boolean;
	created_at: string;
	statuses_count: number;
	followers_count: number;
	following_count: number;
}

export interface IAccountWarning {
	id: string;
	account_id: string;
	content: string;
	created_at: string;
	expires_at: string | null;
	acknowledged: boolean;
}

export interface IAdminAccount {
	id: string;
	username: string;
	domain: string | null;
	created_at: string;
	email: string;
	ip: string;
	role: Role;
	confirmed: boolean;
	approved: boolean;
	disabled: boolean;
	silenced: boolean;
	suspended: boolean;
}
