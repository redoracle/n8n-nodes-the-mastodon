import { INodeProperties } from 'n8n-workflow';
import * as Methods from './AppsMethods';
import { appsOperations, appsFields } from './AppsProperties';

export const appsProperties: INodeProperties[] = [appsOperations, ...appsFields];

export const appsMethods = {
	registerApp: Methods.registerApp,
	verifyCredentials: Methods.verifyAppCredentials,
};
