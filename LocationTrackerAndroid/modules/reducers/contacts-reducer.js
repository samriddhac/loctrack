import {GET_ALL_CONTACTS, ADD_TO_SUBSCRIBER,
	 GET_PERSISTED_STATE, SET_MY_CONTACT,
		UPDATE_SUBS_STATUS, ADD_TO_PUBLISH,
		ADD_TO_PUBLISH_CONTACT} from '../actions/action-types';
import {convertContacts, mergedList,
	updateStatus, updatePublish} from '../utils/utilities';
INITIAL_STATE = {
	myContact:'',
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
			return {...state, subscribedTo: updateStatus(state.subscribedTo, action.payload)};
		case ADD_TO_PUBLISH_CONTACT:
			return {...state, publishingTo: updatePublish(state.publishingTo, state.contacts, action.payload)}; 
		default:
			return state;
	}
}