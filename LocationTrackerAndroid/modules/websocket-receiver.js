import io from 'socket.io-client';

import { EVENT_ON_MESSAGE_RECEIVE, LOCATION_SERVER,
	 EVENT_CONNECTION_ESTABLISHED, EVENT_ESTABLISH_AUTH,
	 EVENT_REQUEST_SUBSCRIPTION,
	 TYPE_CONN_ACK, TYPE_ACK, TYPE_AUTH_REQ,
	 TYPE_AUTH_VALIDATE, TYPE_AUTH_SUCCESS,
	 TYPE_AUTH_FAILURE, TYPE_SUB_REQ,
	 TYPE_SUB_REQ_APPROVED, TYPE_SUB_REQ_DENIED,
	 TYPE_NA, TYPE_LOC} from './common/constants';
import { updateLocation } from './actions/index';
import { ToastAndroid } from 'react-native';
var socket = null;

export function startWebSocketReceiving(store) {
	let socket = getSocket(); 
	socket.on(EVENT_ON_MESSAGE_RECEIVE, (from, msg) => {
		console.log('msg ', msg);
		ToastAndroid.show(JSON.stringify(msg), ToastAndroid.LONG, ToastAndroid.TOP);
		if(msg!==undefined && msg!==null) {
			let obj = msg;
			if(obj!==undefined && obj!==null
				&& obj.t!==undefined && obj.t!==null) {
				switch(obj.t) {
					case TYPE_CONN_ACK:

					case TYPE_ACK:

					case TYPE_AUTH_REQ:

					case TYPE_AUTH_VALIDATE:

					case TYPE_AUTH_SUCCESS:

					case TYPE_AUTH_FAILURE:

					case TYPE_SUB_REQ:

					case TYPE_SUB_REQ_APPROVED:

					case TYPE_SUB_REQ_DENIED:

					case TYPE_NA:

					case TYPE_LOC:
				}
			}
		}
		store.dispatch(updateLocation(msg));
	});

	socket.on("disconnect", function(){
        console.log("client disconnected from server");
    });
}

export function initConnection(from) {
	getSocket().emit(EVENT_CONNECTION_ESTABLISHED, from);
	getSocket().emit(EVENT_ESTABLISH_AUTH, from);
}

export function subscriptionRequest(from, obj) {
	getSocket().emit(EVENT_REQUEST_SUBSCRIPTION, from, JSON.stringify(obj));
}

export function getSocket() {
	if(socket===null) {
		socket = io.connect(LOCATION_SERVER, {reconnect: true});
	}
	return socket;
}