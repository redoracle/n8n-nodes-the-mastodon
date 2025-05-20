// Push Notifications-related interfaces for Mastodon node

export interface IPushSubscriptionKeys {
	p256dh: string;
	auth: string;
}

export interface IPushSubscriptionData {
	endpoint: string;
	keys: IPushSubscriptionKeys;
}

export interface IPushAlerts {
	mention?: boolean;
	status?: boolean;
	reblog?: boolean;
	follow?: boolean;
	follow_request?: boolean;
	favourite?: boolean;
	poll?: boolean;
	update?: boolean;
	'admin.sign_up'?: boolean;
	'admin.report'?: boolean;
}

// Push notification-related interfaces for Mastodon node
export interface IWebPushSubscription {
	id: string;
	endpoint: string;
	server_key: string;
	alerts: IPushAlerts;
	policy: string;
}
