import { INodeProperties } from 'n8n-workflow';
import * as Methods from './EmailsMethods';
import * as Properties from './EmailsProperties';

export const emailsProperties: INodeProperties[] = [
	Properties.emailsOperations,
	...Properties.emailsFields,
];

export const emailsMethods = {
	resendConfirmation: Methods.resendConfirmation,
};
