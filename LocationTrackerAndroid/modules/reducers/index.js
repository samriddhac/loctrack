import { combineReducers } from 'redux';
import ViewStateReducer from './view-state-reducer';

const rootReducer = combineReducers({
	viewState: ViewStateReducer
});

export default rootReducer;