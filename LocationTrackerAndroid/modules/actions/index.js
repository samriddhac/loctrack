import {ACTION_TYPE_LOC_UPDATE, GET_ALL_CONTACTS, 
	CHANGE_VIEW, REQUEST_LOCATION, ADD_TO_SUBSCRIBER,
	SET_MY_LOCATION, GET_PERSISTED_STATE,
	SET_MY_CONTACT} from './action-types';
import {getSocket} from '../websocket-receiver';
import Contacts from 'react-native-contacts';
import {EVENT_REQUEST_SUBSCRIPTION, EVENT_STOP_SUBSCRIPTION,
	EVENT_ALLOW_SUBSCRIPTION, EVENT_DENY_SUBSCRIPTION,
	EVENT_PUBLISH_LOCATION, EVENT_STOP_PUBLISH,
	EVENT_ON_MESSAGE_RECEIVE, STATUS_SENT, STATUS_PENDING,
	STATUS_APPROVED, STATE} from '../common/constants';
import {AsyncStorage} from 'react-native';

export function loadPersistedState(data) {
	return {
		type: GET_PERSISTED_STATE,
		payload: data
	};
}
export function setMyContact(contactno, state) {
	return {
		type: SET_MY_CONTACT,
		payload: contactno
	};
}
export function changeView(value) {
	return {
		type:CHANGE_VIEW,
		payload: value
	};
}

export function requestLocation(data) {
	return {
		type:ADD_TO_SUBSCRIBER,
		payload: data
	};
}

export function updateMyLocation(location) {
	return {
		type:SET_MY_LOCATION,
		payload:location
	};
}

export function updateLocation(data) {
	return {
		type:ACTION_TYPE_LOC_UPDATE,
		payload:data
	};
}

function getContacts() {
	return new Promise((resolve, reject) => {
		Contacts.getAll((err, contacts) => {
		  if(err === 'denied'){
		    reject('denied');
		  } else {
		    resolve(contacts);
		  }
		});
	});
}
export function getAllContacts(data) {
	return (dispatch) => {
		getContacts().then((result)=> {
			dispatch({
				type:GET_ALL_CONTACTS,
				payload:result
			});
		});
	};
}