import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/app';
import store from './store';
import io from 'socket.io-client';
//import {startWebSocketReceiving} from './websocket-receiver';

//startWebSocketReceiving(store);

const socket = io.connect('http://localhost:7000', {reconnect: true});
	socket.on('9717477347', (msg) => {
		console.log(msg);
		store.dispatch(updateLocation(msg));
	});
ReactDOM.render(
<Provider store={ store }>
	<App />
</Provider>, document.querySelector('.react-container')
);