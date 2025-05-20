import { authenticationMethods } from './AuthenticationMethods';
import { authenticationOperations, authenticationFields } from './AuthenticationProperties';
import { INodeProperties } from 'n8n-workflow';

export const authenticationProperties: INodeProperties[] = [
	...authenticationOperations,
	...authenticationFields,
];

export { authenticationMethods };
