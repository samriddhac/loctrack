import {combineReducers} from 'redux';

import LocReducer from './loc-reducer';

const rootReducers = combineReducers({
	locState: LocReducer
});

export default rootReducers;