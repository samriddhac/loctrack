import {GET_ALL_CONTACTS} from '../actions/action-types';

INITIAL_STATE = {
	contacts: []
}

export defaults function(state=INITIAL_STATE, action) {
	switch(action.type) {
		case GET_ALL_CONTACTS:
			return {...state, contacts:action.payload}
		default:
			return state;
	}
}