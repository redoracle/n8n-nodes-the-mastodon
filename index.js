module.exports = {
	nodeClasses: {
		Mastodon: require('./dist/nodes/Mastodon/Mastodon.node').default,
	},
	credentialClasses: {
		MastodonOAuth2Api: require('./dist/credentials/MastodonOAuth2Api.credentials')
			.MastodonOAuth2Api,
		MastodonTokenApi: require('./dist/credentials/MastodonTokenApi.credentials').MastodonTokenApi,
	},
};
