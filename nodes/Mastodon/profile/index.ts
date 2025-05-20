import { INodeProperties } from 'n8n-workflow';
import * as ProfileMethods from './ProfileMethods';
import { profileOperations, profileFields } from './ProfileProperties';

export const profileProperties: INodeProperties[] = [...profileOperations, ...profileFields];

export const profileMethods = {
	deleteAvatar: ProfileMethods.deleteAvatar,
	deleteHeader: ProfileMethods.deleteHeader,
};
