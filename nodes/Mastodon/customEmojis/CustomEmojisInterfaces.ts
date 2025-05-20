// Custom Emojis-related interfaces for Mastodon node
export interface ICustomEmoji {
	shortcode: string;
	url: string;
	static_url: string;
	visible_in_picker: boolean;
	category?: string;
}
