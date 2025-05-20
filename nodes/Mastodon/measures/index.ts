import { INodeProperties } from 'n8n-workflow';
import * as Methods from './MeasureMethods';
import { measureOperations, measureFields } from './MeasureProperties';

export const measureProperties: INodeProperties[] = [...measureOperations, ...measureFields];

export const measureMethods = {
	listMeasures: Methods.listMeasures,
	getMeasureMetrics: Methods.getMeasureMetrics,
};
