// Aggregated favourites module for Mastodon node
import { INodeProperties } from 'n8n-workflow';
import * as Methods from './FavouritesMethods';
import * as Props from './FavouritesProperties';

export const favouritesProperties: INodeProperties[] = [
	Props.favouritesOperations,
	...Props.favouritesFields,
];

export const favouritesMethods = {
	getFavourites: Methods.getFavourites,
	favourite: Methods.favourite,
	unfavourite: Methods.unfavourite,
};
