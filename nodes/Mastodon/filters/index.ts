import { INodeProperties } from 'n8n-workflow';
import * as FilterMethods from './FiltersMethods';
import { filtersOperations, filtersFields } from './FiltersProperties';

export const filterProperties: INodeProperties[] = [...filtersOperations, ...filtersFields];

export const filterMethods = {
	create: FilterMethods.create,
	update: FilterMethods.update,
	remove: FilterMethods.remove,
};
