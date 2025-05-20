import { INodeProperties } from 'n8n-workflow';
import * as Methods from './PushMethods';
import * as Properties from './PushProperties';

export const pushProperties: INodeProperties[] = [
	Properties.pushOperations,
	...Properties.pushFields,
];

export const pushMethods = {
	subscribe: Methods.subscribe,
	get: Methods.get,
	update: Methods.update,
	remove: Methods.remove,
};
