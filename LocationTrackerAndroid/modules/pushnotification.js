import PushNotification  from 'react-native-push-notification';
import {setFCMToken} from './actions/index';
import {setGeoServiceConfigured} from './geolocation-receiver';
import {Alert} from 'react-native';

export function configureNotification(store) {
	PushNotification.configure({
	    onRegister: function(token) {
	        console.log( 'TOKEN:', token.token );
	        store.dispatch(setFCMToken(token.token));
	    },
	    onNotification: function(notification) {
	        console.log( 'NOTIFICATION:', notification );
	        setGeoServiceConfigured(false);
	        if(notification.foreground===true) {
	        	Alert.alert(notification.title, notification.message,
	        		[{text: 'OK', onPress: () => console.log('OK Pressed')}]);
	        }
	    },
	    senderID: "979468621687",
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