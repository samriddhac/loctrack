import io from 'socket.io-client';

import { EVENT_ON_LOCATION_RECEIVE } from './common/constants';
import { updateLocation } from './actions/index';

var socket = null;

export function startWebSocketReceiving(store) {
	let socket = getSocket(); 
	socket.on(EVENT_ON_LOCATION_RECEIVE, (msg) => {
		console.log(msg);
		store.dispatch(updateLocation(msg));
	});
}

export function getSocket() {
	if(socket===null) {
		socket = io.connect('http://54.186.102.87:7000', {reconnect: true});
	}
	return socket;
}