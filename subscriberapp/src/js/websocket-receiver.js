import io from 'socket.io-client';

import { EVENT_ON_LOCATION_RECEIVE } from './common/constants';
import { updateLocation } from './actions/index';

export function startWebSocketReceiving(store) {
	const socket = io.connect('http://localhost:7000', {reconnect: true});
	socket.on(EVENT_ON_LOCATION_RECEIVE, (msg) => {
		console.log(msg);
		store.dispatch(updateLocation(msg));
	});
}