import { INodeProperties } from 'n8n-workflow';
import * as Methods from './DirectoryMethods';
import * as Properties from './DirectoryProperties';

export const directoryProperties: INodeProperties[] = [
	Properties.directoryOperations,
	...Properties.directoryFields,
];

export const directoryMethods = {
	view: Methods.view,
};
