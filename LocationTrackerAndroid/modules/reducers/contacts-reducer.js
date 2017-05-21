import {GET_ALL_CONTACTS, ADD_TO_RECENT} from '../actions/action-types';
import {convertContacts} from '../utils/utilities';
INITIAL_STATE = {
	contacts: [],
	recent:[]
}

export default function(state=INITIAL_STATE, action) {
	switch(action.type) {
		case GET_ALL_CONTACTS:
			return {...state, contacts:convertContacts(action.payload)};
		case ADD_TO_RECENT: 
			return {...state, recent: [...state.recent, action.payload]};
		default:
			return state;
	}
}