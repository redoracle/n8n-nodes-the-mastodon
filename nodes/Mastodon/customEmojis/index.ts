import { INodeProperties } from 'n8n-workflow';
import * as Methods from './CustomEmojisMethods';
import * as Properties from './CustomEmojisProperties';

export const customEmojisProperties: INodeProperties[] = [
	Properties.customEmojisOperations,
	...Properties.customEmojisFields,
];

export const customEmojisMethods = {
	list: Methods.list,
};
