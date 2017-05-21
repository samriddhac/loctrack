import {ACTION_TYPE_LOC_UPDATE, GET_ALL_CONTACTS, 
	CHANGE_VIEW, REQUEST_LOCATION, ADD_TO_RECENT} from './action-types';
import {getSocket} from '../websocket-receiver';
import Contacts from 'react-native-contacts';
import {EVENT_REQUEST_SUBSCRIPTION, EVENT_STOP_SUBSCRIPTION,
	EVENT_ALLOW_SUBSCRIPTION, EVENT_DENY_SUBSCRIPTION,
	EVENT_PUBLISH_LOCATION, EVENT_STOP_PUBLISH,
	EVENT_ON_MESSAGE_RECEIVE, STATUS_SENT, STATUS_PENDING,
	STATUS_APPROVED} from '../common/constants';


export function changeView(value) {
	return {
		type:CHANGE_VIEW,
		payload: value
	};
}

export function requestLocation(data) {
	let objData = {
		to: data.phno,
		from: '9717477347'
	};
	data.status = STATUS_PENDING;
	getSocket().emit(EVENT_REQUEST_SUBSCRIPTION, data.phno, JSON.stringify(objData));;
	return {
		type:ADD_TO_RECENT,
		payload: data
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