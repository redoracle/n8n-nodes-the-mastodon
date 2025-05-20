import { mute, unmute } from './MutesMethods';
import { mutesOperations, mutesFields } from './MutesProperties';

export const mutesProperties = [mutesOperations, ...mutesFields];

export const mutesMethods = {
	mute,
	unmute,
};
