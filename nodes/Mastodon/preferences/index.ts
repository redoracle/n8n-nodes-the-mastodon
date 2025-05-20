import { INodeProperties } from 'n8n-workflow';
import * as PreferenceMethods from './PreferenceMethods';
import { preferenceOperations, preferenceFields } from './PreferenceProperties';

export const preferenceProperties: INodeProperties[] = [
	...preferenceOperations,
	...preferenceFields,
];

export const preferenceMethods = {
	get: PreferenceMethods.get,
};
