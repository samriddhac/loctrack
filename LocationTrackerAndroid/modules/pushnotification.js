import PushNotification  from 'react-native-push-notification';

export function configureNotification() {
	PushNotification.configure({
	    onRegister: function(token) {
	        console.log( 'TOKEN:', token );
	    },
	    // (required) Called when a remote or local notification is opened or received
	    onNotification: function(notification) {
	        console.log( 'NOTIFICATION:', notification );
	    },
	    // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
	    senderID: "979468621687",
	    permissions: {
	        alert: true,
	        badge: true,
	        sound: true
	    },
	    popInitialNotification: true,
	    requestPermissions: true
	});
}

export function sendGeoTrackingNotification() {
	PushNotification.localNotification({
	    id: '100',
	    ticker: "WhereApp notification",
	    autoCancel: true,
	    largeIcon: "ic_launcher",
	    smallIcon: "ic_notification",
	    bigText: "WhereApp is collecting current location of your phone and sending to approved subscribers",
	    subText: "WhereApp notification",
	    vibrate: true,
	    vibration: 300,
	    title: "WhereApp Background Geolocation tracking in ON",
	    message: "WhereApp is collecting current location of your phone and sending to approved subscribers",
	    playSound: false,
	});
}

export function sendAppCloseNotification() {
	PushNotification.localNotification({
	    id: '101',
	    ticker: "WhereApp notification",
	    autoCancel: true,
	    largeIcon: "ic_launcher",
	    smallIcon: "ic_notification",
	    bigText: "WhereApp has been terminated, if you want to continue send your location , please resume the app.",
	    subText: "WhereApp notification",
	    vibrate: true,
	    vibration: 300,
	    title: "WhereApp is closed now",
	    message: "WhereApp has been terminated, if you want to continue send your location , please resume the app.",
	    playSound: false,
	});
}

export function stopGeoTrackingNotification() {
	PushNotification.cancelAllLocalNotifications();
}