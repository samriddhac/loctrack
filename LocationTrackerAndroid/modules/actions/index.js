import {ACTION_TYPE_LOC_UPDATE, GET_ALL_CONTACTS, 
	CHANGE_VIEW, REQUEST_LOCATION, ADD_TO_SUBSCRIBER,
	SET_MY_LOCATION, GET_PERSISTED_STATE,
	SET_MY_CONTACT, UPDATE_SUBS_STATUS,
	ADD_TO_PUBLISH, ADD_TO_PUBLISH_CONTACT} from './action-types';
import {publishLocation} from '../websocket-receiver';
import Contacts from 'react-native-contacts';
import {EVENT_REQUEST_SUBSCRIPTION, EVENT_STOP_SUBSCRIPTION,
	EVENT_ALLOW_SUBSCRIPTION, EVENT_DENY_SUBSCRIPTION,
	EVENT_PUBLISH_LOCATION, EVENT_STOP_PUBLISH,
	EVENT_ON_MESSAGE_RECEIVE, STATUS_SENT, STATUS_PENDING,
	STATUS_APPROVED, STATUS_REJECTED, STATE} from '../common/constants';
import {AsyncStorage} from 'react-native';

export function addToPublish(data) {
	return {
		type: ADD_TO_PUBLISH,
		payload: data
	};
}
export function addToPublishContact(from) {
	return {
		type: ADD_TO_PUBLISH_CONTACT,
		payload: {
			status:STATUS_PENDING,
			from
		}
	};
}
export function updateSubscriberStateAccepted(from) {
	return updateSubscriberState(STATUS_APPROVED, from);
}
export function updateSubscriberStateRejected(from) {
	return updateSubscriberState(STATUS_REJECTED, from);
}
export function updateSubscriberState(status, from) {
	return {
		type: UPDATE_SUBS_STATUS,
		payload: {
			status,
			from
		}
	};
}
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
export function updateMyLocation(data) {
	//publishLocation(data.from, data.location);
	return {
		type:ADD_TO_SUBSCRIBER
		//payload: data
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