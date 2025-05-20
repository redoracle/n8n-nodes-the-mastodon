import { INodeProperties } from 'n8n-workflow';
import * as Methods from './MarkerMethods';
import * as Properties from './MarkersProperties';

export const markerProperties: INodeProperties[] = [
	...Properties.markersOperations,
	...Properties.markersFields,
];

export const markerMethods = {
	getMarkers: Methods.getMarkers,
	saveMarkers: Methods.saveMarkers,
};
