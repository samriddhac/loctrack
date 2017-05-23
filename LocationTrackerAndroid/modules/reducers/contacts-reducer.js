import {GET_ALL_CONTACTS, ADD_TO_SUBSCRIBER} from '../actions/action-types';
import {convertContacts, mergedList} from '../utils/utilities';
INITIAL_STATE = {
	contacts: [],
	subscribedTo:[],
	publishingTo:[]
}

export default function(state=INITIAL_STATE, action) {
	switch(action.type) {
		case GET_ALL_CONTACTS:
			return {...state, contacts:convertContacts(action.payload)};
		case ADD_TO_SUBSCRIBER: 
			let subsList = mergedList(state.subscribedTo, action.payload);
			return {...state, subscribedTo: subsList};
		default:
			return state;
	}
}