import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import {updateMyLocation} from './actions/index';
import {publishLocation} from './websocket-receiver';
import store from './store';

var isBackgroundServiceRunning = false;

export function configureGeolocation() {
  try{ 
    console.log('configuring geo location');
    BackgroundGeolocation.configure({
      desiredAccuracy: 100,
      stationaryRadius: 50,
      distanceFilter: 50,
      locationTimeout: 30,
      startOnBoot: false,
      stopOnTerminate: true,
      locationProvider: BackgroundGeolocation.provider.ANDROID_ACTIVITY_PROVIDER,
      interval: 10000,
      fastestInterval: 10000,
      activitiesInterval: 10000,
      stopOnStillActivity: false
    });
    BackgroundGeolocation.on('location', (location) => {
      console.log(location);
      let from = store.getState().contactState.myContact;
      publishLocation(from, location);
    });

    BackgroundGeolocation.on('stationary', (stationaryLocation) => {
      console.log(stationaryLocation);
    });

    BackgroundGeolocation.on('error', (error) => {
      console.log('[ERROR] BackgroundGeolocation error:', error);
    });
    isGeolocationConfigured = true;
  }
  catch(e) {
    console.log(e);
  }
	
} 

export function start() {
  try{
    if(isGeolocationConfigured === false) {
      configureGeolocation();
    }
    BackgroundGeolocation.start(() => {
      isBackgroundServiceRunning = true;
      console.log('[DEBUG] BackgroundGeolocation started successfully');    
    });
  }
	catch(e) {
    console.log(e);
  }
}
export function stop() {
  try{
    if(isBackgroundServiceRunning) {
      BackgroundGeolocation.stop(() => {
        isBackgroundServiceRunning = false;
        console.log('[DEBUG] BackgroundGeolocation stopped successfully');    
      });
    }
  }
  catch(e) {
    console.log(e);
  }
}

export function isServiceRunning() {
  return isBackgroundServiceRunning;
}

export function setServiceRunning(val) {
  isBackgroundServiceRunning = val;
}

export function isGeoServiceConfigured() {
  return isGeolocationConfigured;
}

export function setGeoServiceConfigured(val) {
  isGeolocationConfigured = val;
}