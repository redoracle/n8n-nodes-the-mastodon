import { INodeProperties } from 'n8n-workflow';
import * as SuggestionMethods from './SuggestionMethods';
import { suggestionOperations, suggestionFields } from './SuggestionProperties';

export const suggestionProperties: INodeProperties[] = [
	...suggestionOperations,
	...suggestionFields,
];

export const suggestionMethods = {
	get: SuggestionMethods.get,
	remove: SuggestionMethods.remove,
};
