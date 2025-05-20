// Aggregated domain blocks module for Mastodon node
import { INodeProperties } from 'n8n-workflow';
import * as Methods from './DomainBlocksMethods';
import * as Properties from './DomainBlocksProperties';

export const domainBlocksProperties: INodeProperties[] = [
	Properties.domainBlocksOperations,
	...Properties.domainBlocksFields,
];

export const domainBlocksMethods = {
	block: Methods.block,
	unblock: Methods.unblock,
};
