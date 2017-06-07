import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import {updateMyLocation} from './actions/index';
import {publishLocation} from './websocket-receiver';

var isBackgroundServiceRunning = false;
export function configureGeolocation(store) {
	BackgroundGeolocation.configure({
      desiredAccuracy: 1000,
      stationaryRadius: 50,
      distanceFilter: 50,
      locationTimeout: 30,
      startOnBoot: false,
      stopOnTerminate: false,
      locationProvider: BackgroundGeolocation.provider.ANDROID_ACTIVITY_PROVIDER,
      interval: 10000,
      fastestInterval: 10000,
      activitiesInterval: 10000,
      stopOnStillActivity: false
    });
    BackgroundGeolocation.on('location', (location) => {
      let from = store.getState().contactState.myContact;
      publishLocation(from, location);
    });

    BackgroundGeolocation.on('stationary', (stationaryLocation) => {
      console.log(stationaryLocation);
    });

    BackgroundGeolocation.on('error', (error) => {
      console.log('[ERROR] BackgroundGeolocation error:', error);
    });
} 

export function start() {
	BackgroundGeolocation.start(() => {
    isBackgroundServiceRunning = true;
    console.log('[DEBUG] BackgroundGeolocation started successfully');    
  });
}
export function stop() {
	BackgroundGeolocation.stop(() => {
    isBackgroundServiceRunning = false;
    console.log('[DEBUG] BackgroundGeolocation stopped successfully');    
  });
}

export function isServiceRunning() {
  return isBackgroundServiceRunning;
}