// Aggregated status module for Mastodon node
import { INodeProperties } from 'n8n-workflow';
import { methods as StatusMethods } from './StatusMethods';
import * as Props from './StatusProperties';

export const statusProperties: INodeProperties[] = [
	Props.statusOperations,
	...Props.createFields,
	...Props.deleteFields,
	...Props.editFields,
	...Props.searchFields,
	...Props.favouriteFields,
	...Props.boostFields,
	...Props.mediaUploadFields,
	...Props.scheduledStatusesFields,
	...Props.statusExtraFields,
	...Props.contextFields,
];

export const statusMethods = {
	create: StatusMethods.create,
	delete: StatusMethods.delete,
	edit: StatusMethods.edit,
	search: StatusMethods.search,
	favourite: StatusMethods.favourite,
	unfavourite: StatusMethods.unfavourite,
	boost: StatusMethods.boost,
	mediaUpload: StatusMethods.mediaUpload,
	scheduledStatuses: StatusMethods.scheduledStatuses,
	view: StatusMethods.view,
	unboost: StatusMethods.unboost,
	bookmark: StatusMethods.bookmark,
	viewEditHistory: StatusMethods.viewEditHistory,
	viewSource: StatusMethods.viewSource,
	context: StatusMethods.context,
};
