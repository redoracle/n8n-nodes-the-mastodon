// Instance-related interfaces for Mastodon node
export interface IInstance {
	domain: string;
	title: string;
	version: string;
	description: string;
	usage: {
		users: {
			active_month: number;
		};
	};
	thumbnail: {
		url: string;
		blurhash: string;
		versions: {
			[key: string]: string;
		};
	};
	languages: string[];
	configuration: {
		urls: {
			streaming: string;
		};
		accounts: {
			max_featured_tags: number;
		};
		statuses: {
			max_characters: number;
			max_media_attachments: number;
			characters_reserved_per_url: number;
		};
		media_attachments: {
			supported_mime_types: string[];
			image_size_limit: number;
			image_matrix_limit: number;
			video_size_limit: number;
			video_frame_rate_limit: number;
			video_matrix_limit: number;
		};
		polls: {
			max_options: number;
			max_characters_per_option: number;
			min_expiration: number;
			max_expiration: number;
		};
	};
	registrations: {
		enabled: boolean;
		approval_required: boolean;
		message: string | null;
	};
	contact: {
		email: string;
		account: any; // Can be expanded to IAccount if needed
	};
	rules: {
		id: string;
		text: string;
	}[];
}
