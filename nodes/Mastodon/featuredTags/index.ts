import { INodeProperties } from 'n8n-workflow';
import * as FeaturedTagMethods from './FeaturedTagMethods';
import { featuredTagOperations, featuredTagFields } from './FeaturedTagProperties';

export const featuredTagProperties: INodeProperties[] = [
	...featuredTagOperations,
	...featuredTagFields,
];

export const featuredTagMethods = {
	list: FeaturedTagMethods.list,
	feature: FeaturedTagMethods.feature,
	unfeature: FeaturedTagMethods.unfeature,
};
