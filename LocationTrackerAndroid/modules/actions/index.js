import {ACTION_TYPE_LOC_UPDATE, GET_ALL_CONTACTS, 
	CHANGE_VIEW, REQUEST_LOCATION, ADD_TO_SUBSCRIBER,
	SET_MY_LOCATION, GET_PERSISTED_STATE,
	SET_MY_CONTACT, UPDATE_SUBS_STATUS,
	ADD_TO_PUBLISH, ADD_TO_PUBLISH_CONTACT,
	REMOVE_PUBLISH_CONTACT, REMOVE_SUBS_CONTACT,
	ADD_SELECTED_TO_MAP, SET_FCM_TOKEN,
	ADD_TO_SELECTED_RECEIVER,
	REMOVE_FROM_SELECTED_RECEIVER, SHARE_REQUEST,
	DONE_SHARE_REQUEST} from './action-types';
import {publishLocation} from '../websocket-receiver';
import Contacts from 'react-native-contacts';
import {EVENT_REQUEST_SUBSCRIPTION, EVENT_STOP_SUBSCRIPTION,
	EVENT_ALLOW_SUBSCRIPTION, EVENT_DENY_SUBSCRIPTION,
	EVENT_PUBLISH_LOCATION, EVENT_STOP_PUBLISH,
	EVENT_ON_MESSAGE_RECEIVE, STATUS_SENT, STATUS_PENDING,
	STATUS_APPROVED, STATUS_REJECTED, STATE} from '../common/constants';
import {AsyncStorage} from 'react-native';

export function updateShareReq(from) {
	return {
		type: SHARE_REQUEST,
		payload: from
	};
}

export function resetShareRequest() {
	return {
		type: DONE_SHARE_REQUEST
	};
}

export function setFCMToken(token) {
	return {
		type: SET_FCM_TOKEN,
		payload: token
	};
}

export function addToSelectedReceiver(data) {
	return {
		type: ADD_TO_SELECTED_RECEIVER,
		payload: data
	};
}

export function removeSelectedReceiver(data) {
	return {
		type: REMOVE_FROM_SELECTED_RECEIVER,
		payload: data
	};
}

export function addToMap(data) {
	return {
		type: ADD_SELECTED_TO_MAP,
		payload: data
	};
}

export function addToPublish(data) {
	return {
		type: ADD_TO_PUBLISH,
		payload: data
	};
}
export function addToPublishContact(from, status=STATUS_PENDING) {
	return {
		type: ADD_TO_PUBLISH_CONTACT,
		payload: {
			status,
			from
		}
	};
}
export function removePublishContact(from) {
	return {
		type: REMOVE_PUBLISH_CONTACT,
		payload: {
			from
		}
	};
}
export function removeSubsContact(from) {
	return {
		type: REMOVE_SUBS_CONTACT,
		payload: {
			from
		}
	};
}
export function updateSubscriberStateAccepted(from) {
	return updateSubscriberState(STATUS_APPROVED, from);
}
export function updateSubscriberStatePending(from) {
	return updateSubscriberState(STATUS_PENDING, from);
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
export function updateLocation(from, data) {
	return {
		type:ACTION_TYPE_LOC_UPDATE,
		payload:{ from, data }
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