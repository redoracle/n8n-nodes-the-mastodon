import { INodeProperties } from 'n8n-workflow';
import * as Methods from './ListMethods';
import * as Properties from './ListProperties';

export const listProperties: INodeProperties[] = [
	...Properties.listOperations,
	...Properties.listFields,
];

export const listMethods = {
	getLists: Methods.getLists,
	getList: Methods.getList,
	createList: Methods.createList,
	updateList: Methods.updateList,
	deleteList: Methods.deleteList,
	getAccountsInList: Methods.getAccountsInList,
	addAccountsToList: Methods.addAccountsToList,
	removeAccountsFromList: Methods.removeAccountsFromList,
};
