import io from 'socket.io-client';

import { EVENT_ON_LOCATION_RECEIVE, LOCATION_SERVER } from './common/constants';
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
		socket = io.connect(LOCATION_SERVER, {reconnect: true});
	}
	return socket;
}