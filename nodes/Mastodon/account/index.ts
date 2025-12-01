// Aggregated account module for Mastodon node
import { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import * as Props from './AccountProperties';
import * as Methods from './AccountMethods';

export const accountProperties: INodeProperties[] = [
	Props.accountOperations as INodeProperties,
	...Props.accountFields,
];

type AccountMethod = (
	this: IExecuteFunctions,
	items: INodeExecutionData[],
	i: number,
) => Promise<unknown>;

export const accountMethods: { [K in keyof typeof Methods]: AccountMethod } = {
	follow: Methods.follow,
	unfollow: Methods.unfollow,
	block: Methods.block,
	mute: Methods.mute,
	verifyCredentials: Methods.verifyCredentials,
	viewProfile: Methods.viewProfile,
	getAccountWarnings: Methods.getAccountWarnings,
	getAdminAccountInfo: Methods.getAdminAccountInfo,
	addNoteToAccount: Methods.addNoteToAccount,
	getAccountFollowers: Methods.getAccountFollowers,
	getAccountFollowing: Methods.getAccountFollowing,
	getAccountLists: Methods.getAccountLists,
	getAccountStatuses: Methods.getAccountStatuses,
	getAccountFeaturedTags: Methods.getAccountFeaturedTags,
	pinAccount: Methods.pinAccount,
	removeAccountFromFollowers: Methods.removeAccountFromFollowers,
	searchAccounts: Methods.searchAccounts,
	unmuteAccount: Methods.unmuteAccount,
	unpinAccount: Methods.unpinAccount,
	registerAccount: Methods.registerAccount,
	updateCredentials: Methods.updateCredentials,
	getMultipleAccounts: Methods.getMultipleAccounts,
	getRelationships: Methods.getRelationships,
	getFamiliarFollowers: Methods.getFamiliarFollowers,
	lookupAccount: Methods.lookupAccount,
};
