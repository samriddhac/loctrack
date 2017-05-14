import React, { Component } from 'react';
import io from 'socket.io-client';

import {EVENT_CONNECTION_ESTABLISHED, 
	EVENT_ESTABLISH_CHANNEL,
	EVENT_REQUEST_SUBSCRIPTION,
	EVENT_STOP_SUBSCRIPTION,
	EVENT_ALLOW_SUBSCRIPTION,
	EVENT_DENY_SUBSCRIPTION, 
	EVENT_PUBLISH_LOCATION,
	EVENT_STOP_PUBLISH
} from '../common/constants';

export default class App extends Component {
	
	constructor(props) {
		super(props);
		this.startSharing = this.startSharing.bind(this);
		this.stopSharing = this.stopSharing.bind(this);

		this.shareIds = [];
		this.channelId = '9717477347';
		this.socket = io.connect('http://localhost:7000', {reconnect: true});
		this.socket.on('connect', function (socket) {
		    console.log('Connected!');
		});
		this.socket.emit(EVENT_ESTABLISH_CHANNEL, 'hi!');
	}

	startSharing() {
		console.log("Started sharing");
		let shareId = setInterval(()=>{
			console.log('Sending data');
			if(navigator && navigator.geolocation) {
				navigator.geolocation.getCurrentPosition((position) => {
					let currentCoord = {};
					currentCoord.lt = position.coords.latitude;
					currentCoord.lg = position.coords.longitude;
					let data = {
						c:this.channelId,
						p:currentCoord
					};
					this.socket.emit(EVENT_PUBLISH_LOCATION, this.channelId, JSON.stringify(data));
				});
			}
		}, 10000);
		this.shareIds.push(shareId);
	}

	stopSharing() {
		console.log("Stopped sharing", this.shareIds);
		if(this.shareIds !== null && this.shareIds.length>0) {
			this.shareIds.forEach((item)=>{
				clearInterval(item);
			});
			this.socket.emit(EVENT_STOP_PUBLISH, this.channelId);
		}
	}

	render() {
		return(
			<div>
				<button type="button" onClick={this.startSharing}>Share location</button>
				<button type="button" onClick={this.stopSharing}>Stop Sharing</button>
			</div>
		);
	}
}