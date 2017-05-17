import { combineReducers } from 'redux';
import ViewStateReducer from './view-state-reducer';
import ContactStateReducer from './contacts-reducer';

const rootReducer = combineReducers({
	viewState: ViewStateReducer,
	contactState: ContactStateReducer
});

export default rootReducer;