import { INodeProperties } from 'n8n-workflow';

export const emailsOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['emails'] } },
	options: [
		{
			name: 'Resend Confirmation',
			value: 'resendConfirmation',
			description: 'Resend confirmation email',
			action: 'Resend confirmation email',
		},
	],
	default: 'resendConfirmation',
};

export const emailsFields: INodeProperties[] = [];
