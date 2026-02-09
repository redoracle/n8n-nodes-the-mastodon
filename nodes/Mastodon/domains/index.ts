// Aggregated domains module for Mastodon node
import { INodeProperties } from 'n8n-workflow';
import * as AllowedProps from './allowed/AllowedDomainProperties';
import * as AllowedMethods from './allowed/AllowedDomainMethods';
import * as BlockedProps from './blocked/BlockedDomainProperties';
import * as BlockedMethods from './blocked/BlockedDomainMethods';
import * as EmailBlockedProps from './email-blocked/EmailBlockedDomainProperties';
import * as EmailBlockedMethods from './email-blocked/EmailBlockedDomainMethods';

export const domainProperties: INodeProperties[] = [
	...AllowedProps.allowedDomainOperations,
	...AllowedProps.allowedDomainFields,
	...BlockedProps.blockedDomainOperations,
	...BlockedProps.blockedDomainFields,
	...EmailBlockedProps.emailBlockedDomainOperations,
	...EmailBlockedProps.emailBlockedDomainFields,
];

export const domainMethods = {
	// Allowed Domains
	listAllowedDomains: AllowedMethods.listAllowedDomains,
	getAllowedDomain: AllowedMethods.getAllowedDomain,

	// Blocked Domains
	listBlockedDomains: BlockedMethods.listBlockedDomains,
	getBlockedDomain: BlockedMethods.getBlockedDomain,
	blockDomain: BlockedMethods.blockDomain,

	// Email Blocked Domains
	listEmailBlockedDomains: EmailBlockedMethods.listEmailBlockedDomains,
	getEmailBlockedDomain: EmailBlockedMethods.getEmailBlockedDomain,
};
