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
	 EVENT_ADD_TO_PUBLISH,
	 EVENT_SET_FCM_TOKEN,
	 EVENT_ACK_PENDING_QUEUE,
	 EVENT_SHARE_REQUEST,
	 TYPE_CONN_ACK, TYPE_ACK, TYPE_AUTH_REQ,
	 TYPE_AUTH_VALIDATE, TYPE_AUTH_SUCCESS,
	 TYPE_AUTH_FAILURE, TYPE_SUB_REQ,
	 TYPE_SUB_REQ_APPROVED, TYPE_SUB_REQ_DENIED,
	 TYPE_NA, TYPE_LOC, 
	 TYPE_LOC_STOP, TYPE_NR,
	 TYPE_PUB_REQ_REMOVED, 
	 TYPE_SUB_REQ_REMOVED,
	 TYPE_SHARE_REQ} from './common/constants';
import { updateLocation, updateSubscriberStateAccepted,
		updateSubscriberStateRejected,
		addToPublishContact, removePublishContact, 
		removeSubsContact, updateShareReq } from './actions/index';
import { ToastAndroid } from 'react-native';

var socket = null;
var isOnline = false;
var isFcmRegistered = false;

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
					sendFcmRequest(store);
					console.log('Connection established');
					break;
				case TYPE_ACK:
					console.log('Ackowledged!');
					break;
				case TYPE_AUTH_REQ:
					break;
				case TYPE_AUTH_VALIDATE:
					ToastAndroid.showWithGravity('Registered Successfully', ToastAndroid.SHORT, ToastAndroid.TOP);
					break;
				case TYPE_AUTH_SUCCESS:
					break;
				case TYPE_AUTH_FAILURE:
					break;
				case TYPE_SUB_REQ:
					store.dispatch(addToPublishContact(obj.from));
					clearPendingQueue(obj.id, from);
					break;
				case TYPE_SUB_REQ_APPROVED:
					store.dispatch(updateSubscriberStateAccepted(from));
					clearPendingQueue(obj.id, from);
					break;
				case TYPE_SUB_REQ_DENIED:
					store.dispatch(updateSubscriberStateRejected(from));
					clearPendingQueue(obj.id, from);
					break;
				case TYPE_PUB_REQ_REMOVED:
					store.dispatch(removePublishContact(from));
					clearPendingQueue(obj.id, from);
					break;
				case TYPE_SUB_REQ_REMOVED:
					store.dispatch(removeSubsContact(from));
					clearPendingQueue(obj.id, from);
					break;
				case TYPE_NA:
					ToastAndroid.showWithGravity('A notification has been sent to the user', ToastAndroid.SHORT, ToastAndroid.TOP);
					break;
				case TYPE_LOC:
					let objloc = obj.data;
					console.log('Received location from ', from, 'data ', objloc);
					store.dispatch(updateLocation(from, objloc));
					break;
				case TYPE_LOC_STOP:
					store.dispatch(updateSubscriberStateAccepted(from));
					break;
				case TYPE_NR:
					ToastAndroid.showWithGravity('User is not registered with WhereApp', ToastAndroid.SHORT, ToastAndroid.TOP);
					break;
				case TYPE_SHARE_REQ:
					store.dispatch(updateShareReq(obj.from));
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

function sendFcmRequest(store) {
	if(isFcmRegistered==false) {
		let state = store.getState();
        if(state!==undefined && state!==null && 
        	state.contactState!==undefined &&
        	state.contactState!==null &&
        	state.contactState.myContact!==undefined &&
        	state.contactState.myContact!==null &&
        	state.contactState.myContact!=='' &&
        	state.deviceState!==undefined &&
        	state.deviceState!==null &&
        	state.deviceState.fcmToken!==undefined &&
        	state.deviceState.fcmToken!==null &&
        	state.deviceState.fcmToken!=='') {
        	let from = state.contactState.myContact;
        	let fcmToken = state.deviceState.fcmToken;
        	setFcmToken(from, fcmToken);
        	isFcmRegistered = true;
        }
	}
}

export function checkStatus() {
	return isOnline;
}

export function initConnection(from) {
	getSocket().emit(EVENT_CONNECTION_ESTABLISHED, from);
}

export function clearPendingQueue(id, from) {
	if(id!==undefined && id!==null) {
		if(isOnline===true) {
			getSocket().emit(EVENT_ACK_PENDING_QUEUE, from, {id});
			return true;
		}
		else {
			addToPendingQueue({
				event:EVENT_ACK_PENDING_QUEUE,
				from:from,
				data: {id}
			});
		}
	}
	return false;
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

export function shareRequest(from, obj) {
	if(checkStatus()===true) {
		getSocket().emit(EVENT_SHARE_REQUEST, from, JSON.stringify(obj));
		return true;
	}
	else {
		addToPendingQueue({
			event:EVENT_SHARE_REQUEST,
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

export function addDataToPublish(from, obj) {
	if(checkStatus()===true) {
		getSocket().emit(EVENT_ADD_TO_PUBLISH, from, JSON.stringify(obj));
		return true;
	}
	else {
		addToPendingQueue({
			event:EVENT_ADD_TO_PUBLISH,
			from:from,
			data:JSON.stringify(obj)
		});
		ToastAndroid.showWithGravity('No Internet access', ToastAndroid.SHORT, ToastAndroid.TOP);
	}
	return false;
}

export function publishLocation(from, location, selectedReceiver){
	let obj = {
		t:TYPE_LOC,
		data:location,
		selected:selectedReceiver
	};
	if(checkStatus()===true) {
		getSocket().emit(EVENT_PUBLISH_LOCATION, from, JSON.stringify(obj));
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

export function stopPublishLocation(from, location, selectedReceiver){
	let obj = {
		t:TYPE_LOC_STOP,
		data:location,
		selected:selectedReceiver
	};
	if(checkStatus()===true) {
		getSocket().emit(EVENT_PUBLISH_LOCATION, from, JSON.stringify(obj));
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
export function setFcmToken(from, token) {
	if(checkStatus()===true) {
		getSocket().emit(EVENT_SET_FCM_TOKEN, from, JSON.stringify({token}));
		return true;
	}
	else {
		addToPendingQueue({
			event:EVENT_SET_FCM_TOKEN,
			from:from,
			data:JSON.stringify({token})
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
		pendingEvents.forEach((obj)=>{
			if(obj!==undefined && obj!==null) {
				getSocket().emit(obj.event, obj.from, obj.data);
			}
		});
		pendingEvents = [];
	}
}