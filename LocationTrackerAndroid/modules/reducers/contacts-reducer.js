import {GET_ALL_CONTACTS, ADD_TO_SUBSCRIBER,
	 GET_PERSISTED_STATE, SET_MY_CONTACT,
		UPDATE_SUBS_STATUS, ADD_TO_PUBLISH,
		ADD_TO_PUBLISH_CONTACT,
		ACTION_TYPE_LOC_UPDATE,
		REMOVE_PUBLISH_CONTACT, 
		REMOVE_SUBS_CONTACT,
		ADD_SELECTED_TO_MAP,
		ADD_TO_SELECTED_RECEIVER,
		REMOVE_FROM_SELECTED_RECEIVER,
		SHARE_REQUEST,
		DONE_SHARE_REQUEST} from '../actions/action-types';
import {convertContacts, 
	mergedList,
	updateStatus, 
	updatePublish,
	updateSubLocations, 
	removeContact,
	removeItem,
	updateShareRequest,
	doneShareRequest } from '../utils/utilities';
	
INITIAL_STATE = {
	myContact:'',
	contacts: [],
	subscribedTo:[],
	publishingTo:[],
	selectedRecord: -999,
	selectedReceiver:[]
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
		case ADD_TO_SELECTED_RECEIVER:
			let newSelection = [...state.selectedReceiver, action.payload];
			return {...state, selectedReceiver: [...newSelection]};
		case REMOVE_FROM_SELECTED_RECEIVER:
			return {...state, selectedReceiver: removeItem(state.selectedReceiver, action.payload)};
		case SHARE_REQUEST:
			return {...state, publishingTo:updateShareRequest(state.publishingTo, action.payload)};
		case DONE_SHARE_REQUEST:
			return {...state, publishingTo:doneShareRequest(state.publishingTo, state.selectedReceiver)};
		default:
			return state;
	}
}