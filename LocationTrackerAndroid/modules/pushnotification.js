import PushNotification  from 'react-native-push-notification';

export function configureNotification() {
	PushNotification.configure({
	    
	    onRegister: function(token) {
	        console.log( 'TOKEN:', token );
	    },

	    // (required) Called when a remote or local notification is opened or received
	    onNotification: function(notification) {
	        //console.log( 'NOTIFICATION:', notification );
	    },

	    // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
	    senderID: "YOUR GCM SENDER ID",

	    // IOS ONLY (optional): default: all - Permissions to register.
	    permissions: {
	        alert: true,
	        badge: true,
	        sound: true
	    },

	    // Should the initial notification be popped automatically
	    // default: true
	    popInitialNotification: true,

	    /**
	      * (optional) default: true
	      * - Specified if permissions (ios) and token (android and ios) will requested or not,
	      * - if not, you must call PushNotificationsHandler.requestPermissions() later
	      */
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

export function stopGeoTrackingNotification() {
	PushNotification.cancelAllLocalNotifications();
}