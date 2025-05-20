export interface IStatus {
	status: string;
	in_reply_to_id?: string;
	spoiler_text?: string;
	sensitive?: boolean;
	language?: string;
	'media_ids[]'?: string;
}
