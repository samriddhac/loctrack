import { combineReducers } from 'redux';
import ViewStateReducer from './view-state-reducer';
import ContactStateReducer from './contacts-reducer';
import MyLocationStateReducer from './my-location-reducer';
import DeviceReducer from './device-reducer';

const rootReducer = combineReducers({
	viewState: ViewStateReducer,
	contactState: ContactStateReducer,
	myLocationState: MyLocationStateReducer,
	deviceState: DeviceReducer
});

export default rootReducer;