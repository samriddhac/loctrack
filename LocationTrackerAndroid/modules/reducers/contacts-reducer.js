import {GET_ALL_CONTACTS, ADD_TO_SUBSCRIBER,
	 GET_PERSISTED_STATE, SET_MY_CONTACT,
		UPDATE_SUBS_STATUS, ADD_TO_PUBLISH,
		ADD_TO_PUBLISH_CONTACT,
		ACTION_TYPE_LOC_UPDATE,
		REMOVE_PUBLISH_CONTACT, 
		REMOVE_SUBS_CONTACT,
		ADD_SELECTED_TO_MAP} from '../actions/action-types';
import {convertContacts, 
	mergedList,
	updateStatus, 
	updatePublish,
	updateSubLocations, 
	removeContact} from '../utils/utilities';
	
INITIAL_STATE = {
	myContact:'',
	contacts: [],
	subscribedTo:[],
	publishingTo:[],
	selectedRecord: -999
}

export default function(state=INITIAL_STATE, action) {
	switch(action.type) {
		case GET_ALL_CONTACTS:
			return {...state, contacts:convertContacts(action.payload)};
		case ADD_TO_SUBSCRIBER: 
			let subsList = mergedList(state.subscribedTo, action.payload);
			return {...state, subscribedTo: subsList};
		case ADD_TO_PUBLISH: 
			let pubList = mergedList(state.publishingTo, action.payload);
			return {...state, publishingTo: pubList};
		case GET_PERSISTED_STATE:
			return {...state,
				myContact: action.payload.myContact, 
				subscribedTo: action.payload.subscribedTo,
				publishingTo: action.payload.publishingTo};
		case SET_MY_CONTACT:
			return {...state, myContact: action.payload};
		case UPDATE_SUBS_STATUS: 
			return {...state, subscribedTo: updateStatus(state.subscribedTo, action.payload, state.contacts)};
		case ADD_TO_PUBLISH_CONTACT:
			return {...state, publishingTo: updatePublish(state.publishingTo, state.contacts, action.payload)}; 
		case ACTION_TYPE_LOC_UPDATE:
			return {...state, subscribedTo: updateSubLocations(state.subscribedTo, action.payload)};
		case REMOVE_PUBLISH_CONTACT:
			return {...state, publishingTo: removeContact(state.publishingTo, action.payload)};
		case REMOVE_SUBS_CONTACT:
			return {...state, subscribedTo: removeContact(state.subscribedTo, action.payload)};
		case ADD_SELECTED_TO_MAP:
			return {...state, selectedRecord: action.payload};
		default:
			return state;
	}
}