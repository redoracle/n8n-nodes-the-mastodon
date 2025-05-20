import { INodeProperties } from 'n8n-workflow';
import * as Methods from './ProofMethods';
import { proofOperations, proofFields } from './ProofProperties';

export const proofProperties: INodeProperties[] = [...proofOperations, ...proofFields];

export const proofMethods = {
	listProofs: Methods.listProofs,
};
