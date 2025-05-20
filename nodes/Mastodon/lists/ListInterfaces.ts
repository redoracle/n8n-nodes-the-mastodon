// List-related interfaces for Mastodon node
export interface IList {
	id: string;
	title: string;
	replies_policy?: string;
	exclusive?: boolean;
}
