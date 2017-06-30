import io from 'socket.io-client';

import { EVENT_ON_MESSAGE_RECEIVE, 
	 LOCATION_SERVER,
	 EVENT_CONNECTION_ESTABLISHED, 
	 EVENT_ESTABLISH_AUTH,
	 EVENT_REQUEST_SUBSCRIPTION,
	 EVENT_REQUEST_SUBSCRIPTION_ACCEPTED,
	 EVENT_PUBLISH_LOCATION,
	 EVENT_STOP_SUBSCRIPTION,
	 EVENT_REMOVE_PUBLISH,
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
var isOnline = false;

var pendingEvents = [];

export function startWebSocketReceiving(store) {
	let socket = getSocket(); 
	socket.on(EVENT_ON_MESSAGE_RECEIVE, (from, msg) => {
		console.log('msg ', msg);
		let obj = msg;
		if(obj!==undefined && obj!==null
			&& obj.t!==undefined && obj.t!==null) {
			switch(obj.t) {
				case TYPE_CONN_ACK:
					isOnline = true;
					releasePendingQueue();
					console.log('Connection established');
					break;
				case TYPE_ACK:
					console.log('Ackowledged!');
					break;
				case TYPE_AUTH_REQ:
					break;
				case TYPE_AUTH_VALIDATE:
					ToastAndroid.showWithGravity('Registered Successfully!!', ToastAndroid.SHORT, ToastAndroid.TOP);
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
					store.dispatch(updateSubscriberStateRejected(from));
					break;
				case TYPE_NA:
					ToastAndroid.showWithGravity('User offline!', ToastAndroid.SHORT, ToastAndroid.TOP);
					break;
				case TYPE_LOC:
					let objloc = JSON.parse(obj.data);
					store.dispatch(updateLocation(from, objloc));
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
		isOnline = false;
        console.log("client disconnected from server");
    });
}

export function checkStatus() {
	return isOnline;
}

export function initConnection(from) {
	getSocket().emit(EVENT_CONNECTION_ESTABLISHED, from);
}

export function initAuth(from) {
	if(isOnline===true) {
		getSocket().emit(EVENT_ESTABLISH_AUTH, from);
		return true;
	}
	else {
		addToPendingQueue({
			event:EVENT_ESTABLISH_AUTH,
			from:from
		});
	}
	return false;	
}

export function subscriptionRequest(from, obj) {
	if(checkStatus()===true) {
		getSocket().emit(EVENT_REQUEST_SUBSCRIPTION, from, JSON.stringify(obj));
		return true;
	}
	else {
		addToPendingQueue({
			event:EVENT_REQUEST_SUBSCRIPTION,
			from:from,
			data:JSON.stringify(obj)
		});
		ToastAndroid.showWithGravity('No Internet access', ToastAndroid.SHORT, ToastAndroid.TOP);
	}
	return false;
}

export function removeSubs(from, obj) {
	if(checkStatus()===true) {
		getSocket().emit(EVENT_STOP_SUBSCRIPTION, from, JSON.stringify(obj));
		return true;
	}
	else {
		addToPendingQueue({
			event:EVENT_STOP_SUBSCRIPTION,
			from:from,
			data:JSON.stringify(obj)
		});
		ToastAndroid.showWithGravity('No Internet access', ToastAndroid.SHORT, ToastAndroid.TOP);
	}
	return false;
}

export function removePubs(from, obj) {
	if(checkStatus()===true) {
		getSocket().emit(EVENT_REMOVE_PUBLISH, from, JSON.stringify(obj));
		return true;
	}
	else {
		addToPendingQueue({
			event:EVENT_REMOVE_PUBLISH,
			from:from,
			data:JSON.stringify(obj)
		});
		ToastAndroid.showWithGravity('No Internet access', ToastAndroid.SHORT, ToastAndroid.TOP);
	}
	return false;
}

export function subscriptionApproveRequest(from, obj) {
	if(checkStatus()===true) {
		getSocket().emit(EVENT_REQUEST_SUBSCRIPTION_ACCEPTED, from, JSON.stringify(obj));
		return true;
	}
	else {
		addToPendingQueue({
			event:EVENT_REQUEST_SUBSCRIPTION_ACCEPTED,
			from:from,
			data:JSON.stringify(obj)
		});
		ToastAndroid.showWithGravity('No Internet access', ToastAndroid.SHORT, ToastAndroid.TOP);
	}
	return false;
}

export function publishLocation(from, location){
	if(checkStatus()===true) {
		getSocket().emit(EVENT_PUBLISH_LOCATION, from, JSON.stringify(location));
		return true;
	}
	else {
		addToPendingQueue({
			event:EVENT_PUBLISH_LOCATION,
			from:from,
			data:JSON.stringify(obj)
		});
		ToastAndroid.showWithGravity('No Internet access', ToastAndroid.SHORT, ToastAndroid.TOP);
	}
	return false;
}

export function getSocket() {
	if(socket===null) {
		socket = io.connect(LOCATION_SERVER, {reconnect: true});
	}
	return socket;
}

function addToPendingQueue(obj) {
	pendingEvents.push(obj);
}

function releasePendingQueue() {
	if(pendingEvents!==undefined && pendingEvents!==null &&
		pendingEvents.length>0) {
		pendingEvents.reverse();
		pendingEvents.forEach((obj)=>{
			if(obj!==undefined && obj!==null) {
				getSocket().emit(obj.event, obj.from, obj.data);
			}
		});
		pendingEvents = [];
	}
}