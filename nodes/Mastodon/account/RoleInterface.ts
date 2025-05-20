// Role interface for Mastodon admin accounts
export interface Role {
	id: number;
	name: string;
	color: string;
	position: number;
	permissions: number;
	highlighted: boolean;
	created_at: string;
	updated_at: string;
}
