// Aggregated blocks module for Mastodon node
import { INodeProperties } from 'n8n-workflow';
import * as Methods from './BlocksMethods';
import * as Properties from './BlocksProperties';

export const blocksProperties: INodeProperties[] = [
	Properties.blocksOperations,
	...Properties.blocksFields,
];

export const blocksMethods = {
	block: Methods.block,
	unblock: Methods.unblock,
};
