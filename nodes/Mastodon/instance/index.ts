import { INodeProperties } from 'n8n-workflow';
import * as Methods from './InstanceMethods';
import * as Properties from './InstanceProperties';

export const instanceProperties: INodeProperties[] = [...Properties.instanceOperations];

export const instanceMethods = {
	getServerInfo: Methods.getServerInfo,
};
