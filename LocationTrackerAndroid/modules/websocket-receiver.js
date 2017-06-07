import io from 'socket.io-client';

import { EVENT_ON_MESSAGE_RECEIVE, 
	 LOCATION_SERVER,
	 EVENT_CONNECTION_ESTABLISHED, 
	 EVENT_ESTABLISH_AUTH,
	 EVENT_REQUEST_SUBSCRIPTION,
	 EVENT_REQUEST_SUBSCRIPTION_ACCEPTED,
	 EVENT_PUBLISH_LOCATION,
	 TYPE_CONN_ACK, TYPE_ACK, TYPE_AUTH_REQ,
	 TYPE_AUTH_VALIDATE, TYPE_AUTH_SUCCESS,
	 TYPE_AUTH_FAILURE, TYPE_SUB_REQ,
	 TYPE_SUB_REQ_APPROVED, TYPE_SUB_REQ_DENIED,
	 TYPE_NA, TYPE_LOC} from './common/constants';
import { updateLocation, updateSubscriberStateAccepted,
		updateSubscriberStateRejected,
		addToPublishContact } from './actions/index';
import { ToastAndroid } from 'react-native';
var socket = null;

export function startWebSocketReceiving(store) {
	let socket = getSocket(); 
	socket.on(EVENT_ON_MESSAGE_RECEIVE, (from, msg) => {
		console.log('msg ', msg);
		ToastAndroid.show(JSON.stringify(msg), ToastAndroid.LONG, ToastAndroid.TOP);
		let obj = msg;
		if(obj!==undefined && obj!==null
			&& obj.t!==undefined && obj.t!==null) {
			switch(obj.t) {
				case TYPE_CONN_ACK:
					console.log('Connection established');
					break;
				case TYPE_ACK:
					console.log('Ackowledged!');
					break;
				case TYPE_AUTH_REQ:
					break;
				case TYPE_AUTH_VALIDATE:
					break;
				case TYPE_AUTH_SUCCESS:
					break;
				case TYPE_AUTH_FAILURE:
					break;
				case TYPE_SUB_REQ:
					store.dispatch(addToPublishContact(obj.from));
					break;
				case TYPE_SUB_REQ_APPROVED:
					store.dispatch(updateSubscriberStateAccepted(from));
					break;
				case TYPE_SUB_REQ_DENIED:
					store.dispatch(updateLocation(from, obj.data));
					break;
				case TYPE_NA:
					ToastAndroid.show('User offline!', ToastAndroid.SHORT, ToastAndroid.TOP);
					break;
				case TYPE_LOC:
					store.dispatch(updateSubscriberStateRejected(from));
					break;
			}
		}
	});
	socket.on("connect", function(){
        console.log("client connected to server");
        let state = store.getState();
        if(state!==undefined && state!==null && 
        	state.contactState!==undefined &&
        	state.contactState!==null &&
        	state.contactState.myContact!==undefined &&
        	state.contactState.myContact!==null &&
        	state.contactState.myContact!=='') {
        	let from = state.contactState.myContact;
        	if(from!==undefined && from!==null && from!=='') {
	        	initConnection(from);
	        }
        }
    });
    socket.on("reconnect", function(){
        console.log("client reconnected from server");
        let state = store.getState();
        if(state!==undefined && state!==null && 
        	state.contactState!==undefined &&
        	state.contactState!==null &&
        	state.contactState.myContact!==undefined &&
        	state.contactState.myContact!==null &&
        	state.contactState.myContact!=='') {
        	let from = state.contactState.myContact;
        	if(from!==undefined && from!==null && from!=='') {
	        	initConnection(from);
	        }
        }  
    });
	socket.on("disconnect", function(){
        console.log("client disconnected from server");
    });
}

export function initAuth(from) {
	getSocket().emit(EVENT_ESTABLISH_AUTH, from);
}

export function initConnection(from) {
	getSocket().emit(EVENT_CONNECTION_ESTABLISHED, from);
}

export function subscriptionRequest(from, obj) {
	getSocket().emit(EVENT_REQUEST_SUBSCRIPTION, from, JSON.stringify(obj));
}

export function subscriptionApproveRequest(from, obj) {
	getSocket().emit(EVENT_REQUEST_SUBSCRIPTION_ACCEPTED, from, JSON.stringify(obj));
}

export function publishLocation(from, location){
	getSocket().emit(EVENT_PUBLISH_LOCATION, from, JSON.stringify(location));
}

export function getSocket() {
	if(socket===null) {
		socket = io.connect(LOCATION_SERVER, {reconnect: true});
	}
	return socket;
}