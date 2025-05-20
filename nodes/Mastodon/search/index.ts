import { INodeProperties } from 'n8n-workflow';
import * as Methods from './SearchMethods';
import * as Properties from './SearchProperties';

export const searchProperties: INodeProperties[] = [
	Properties.searchOperations,
	...Properties.searchFields,
];

export const searchMethods = {
	search: Methods.search,
};
