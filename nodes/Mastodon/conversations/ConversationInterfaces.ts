export interface IConversation {
	id: string;
	accounts: any[]; // Replace with IAccount[] if needed
	unread: boolean;
	last_status?: any; // Replace with IStatus if needed
}
