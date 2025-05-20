// Aggregated favourites module for Mastodon node
import { INodeProperties } from 'n8n-workflow';
import * as Props from './FavouritesProperties';
import * as Methods from './FavouritesMethods';

export const favouritesProperties: INodeProperties[] = [
	Props.favouritesOperations,
	...Props.favouritesFields,
];

export const favouritesMethods = {
	favourite: Methods.favourite,
	unfavourite: Methods.unfavourite,
};
