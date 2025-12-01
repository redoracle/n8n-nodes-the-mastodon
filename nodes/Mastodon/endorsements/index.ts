import { INodeProperties } from 'n8n-workflow';
import * as EndorsementMethods from './EndorsementMethods';
import { endorsementFields, endorsementOperations } from './EndorsementProperties';

export const endorsementProperties: INodeProperties[] = [
	...endorsementOperations,
	...endorsementFields,
];

export const endorsementMethods = {
	get: EndorsementMethods.get,
};
