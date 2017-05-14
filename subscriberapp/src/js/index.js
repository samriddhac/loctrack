import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/app';
import store from './store';
import io from 'socket.io-client';
import {startWebSocketReceiving} from './websocket-receiver';

startWebSocketReceiving(store);
ReactDOM.render(
<Provider store={ store }>
	<App />
</Provider>, document.querySelector('.react-container')
);