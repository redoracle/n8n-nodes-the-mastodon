import { INodeProperties } from 'n8n-workflow';
import * as Methods from './ConversationMethods';
import * as Properties from './ConversationProperties';

export const conversationProperties: INodeProperties[] = [
	...Properties.conversationOperations,
	...Properties.conversationFields,
];

export const conversationMethods = {
	getConversations: Methods.getConversations,
	removeConversation: Methods.removeConversation,
	markAsRead: Methods.markAsRead,
};
