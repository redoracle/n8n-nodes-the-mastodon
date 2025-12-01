import { INodeProperties } from 'n8n-workflow';
import * as Methods from './ConversationMethods';
import * as Properties from './ConversationProperties';

export const conversationProperties: INodeProperties[] = [
	...Properties.conversationOperations,
	...Properties.conversationFields,
];

export const conversationMethods = {
	get: Methods.get,
	removeConversation: Methods.removeConversation,
	markAsRead: Methods.markAsRead,
};
