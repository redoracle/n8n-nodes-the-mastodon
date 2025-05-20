// Admin-related interfaces for Mastodon node
export interface ICanonicalEmailBlock {
	id: string;
	canonical_email_hash: string;
}

export interface ICohortDataPoint {
	date: string;
	rate: number;
	value: string;
}

export interface ICohort {
	period: string;
	frequency: 'day' | 'month';
	data: ICohortDataPoint[];
}

export interface IDimension {
	id: string;
	name: string;
	created_at: string;
	updated_at: string;
}

export interface IAdminDomainAllow {
	id: string;
	domain: string;
	created_at: string;
}

export interface IAdminDomainBlock {
	id: string;
	domain: string;
	digest: string;
	created_at: string;
	severity: 'noop' | 'silence' | 'suspend';
	reject_media: boolean;
	reject_reports: boolean;
	private_comment: string;
	public_comment: string;
	obfuscate: boolean;
}

export interface IEmailDomainBlockHistory {
	day: number;
	accounts: number;
	uses: number;
}

export interface IAdminEmailDomainBlock {
	id: string;
	domain: string;
	created_at: string;
	history: IEmailDomainBlockHistory[];
}

export interface IAdminIp {
	id: string;
	ip: string;
	used_at: string;
	account_id: string;
}

export interface IAdminIpBlock {
	id: string;
	ip: string;
	severity: 'noop' | 'sign_up_requires_approval' | 'sign_up_block' | 'block';
	comment: string | null;
	created_at: string;
}

export interface IAdminRole {
	id: string;
	name: string;
	permissions: number;
	color: string;
	highlighted: boolean;
	position: number;
	created_at: string;
	updated_at: string;
}

export interface IAdminRule {
	id: string;
	text: string;
	created_at: string;
	updated_at: string;
}

export interface IAdminAnnouncement {
	id: string;
	content: string;
	starts_at: string;
	ends_at: string;
	published: boolean;
	all_day: boolean;
	created_at: string;
	updated_at: string;
}

export interface IAdminScheduledStatus {
	id: string;
	scheduled_at: string;
	params: Record<string, any>;
	media_attachments: Array<Record<string, any>>;
}
