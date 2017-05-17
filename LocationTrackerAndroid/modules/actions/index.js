import {ACTION_TYPE_LOC_UPDATE, GET_ALL_CONTACTS} from './action-types';
import Contacts from 'react-native-contacts';

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
		    console.log(contacts);
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