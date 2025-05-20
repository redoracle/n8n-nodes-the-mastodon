// Announcement-related interfaces for Mastodon node
export interface IAnnouncement {
	id: string;
	content: string;
	starts_at: string | null;
	ends_at: string | null;
	all_day: boolean;
	published: boolean;
	read?: boolean;
}
