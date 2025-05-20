import { INodeProperties } from 'n8n-workflow';
import * as EndorsementMethods from './EndorsementMethods';
import { endorsementOperations, endorsementFields } from './EndorsementProperties';

export const endorsementProperties: INodeProperties[] = [
	...endorsementOperations,
	...endorsementFields,
];

export const endorsementMethods = {
	list: EndorsementMethods.list,
};
