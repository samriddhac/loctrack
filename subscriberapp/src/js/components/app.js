import React, { Component } from 'react';
import io from 'socket.io-client';

import Loader from '../components/loader';
import {EVENT_CONNECTION_ESTABLISHED, 
	EVENT_ESTABLISH_CHANNEL,
	EVENT_REQUEST_SUBSCRIPTION,
	EVENT_STOP_SUBSCRIPTION,
	EVENT_ALLOW_SUBSCRIPTION,
	EVENT_DENY_SUBSCRIPTION, 
	EVENT_PUBLISH_LOCATION,
	EVENT_STOP_PUBLISH
} from '../common/constants';
//import {socket} from '../websocket-receiver';
const zoom =14;
const socket = io.connect('http://localhost:7000', {reconnect: true});
export default class App extends Component {

	constructor(props) {
		super(props);
		this.state = {searchterm : '', loading: false};
		this.onFormSubmit = this.onFormSubmit.bind(this);
		socket.on('connection', function (socket) {});
		socket.emit(EVENT_ESTABLISH_CHANNEL, 'hi!');
	}
	componentDidMount() {
		this.centercoord = { lat: 51.4826, lng: 0.0077 };
		if(!this.props.coord || (!this.props.coord.lat && !this.props.coord.lon)) {
			if(navigator && navigator.geolocation) {
				navigator.geolocation.getCurrentPosition((position) => {
					this.centercoord.lat = position.coords.latitude;
					this.centercoord.lng = position.coords.longitude;
					this.renderMap();
				});
			}
		}
		else {
			this.centercoord = {
				lat:this.props.coord.lat,
				lng:this.props.coord.lon
			};
		}
		this.renderMap();
	}
	onInputChange(e) {
		this.setState({ ...this.state, searchterm: e.target.value });
	}
	onFormSubmit(event) {
		event.preventDefault();
		let newState = { ...this.state, loading: true};
		if(this.state.searchterm && this.state.searchterm!=='') {
			let data = {
				to:this.state.searchterm
			};
			socket.emit(EVENT_REQUEST_SUBSCRIPTION, this.channelId, JSON.stringify(data));
		}
	}
	
	renderMap() {
		this.map = new google.maps.Map(this.refs.map, {
			mapTypeControlOptions: {
              style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
              position: google.maps.ControlPosition.TOP_CENTER
          	},
			zoom:zoom,
			center: this.centercoord,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});
		this.placeService = new google.maps.places.PlacesService(this.map);
		this.setMarker();
	}
	setMarker() {
		this.marker = new google.maps.Marker({
          position: this.centercoord,
          animation: google.maps.Animation.DROP,
          icon:'./images/icons/google-map/default.png',
          map: this.map
        });
	}
	getLoadingStyle() {
		if(this.state.loading === true) {
			return { display: 'block'};
		}
		else {
			return { display: 'none'}
		}
	}
	render() {
		return(
			<div>
				<form onSubmit={this.onFormSubmit}>
				  	<div className="form-group search-container">
				  		<input type="text"
				  		value={this.state.searchterm}
				  		onChange={(e)=>{ this.onInputChange(e) }} 
				  		className="form-control text-input-search" 
				  		placeholder="Please provide contact name, number" />
				  		<button className="btn btn-default btn-md pull-right">Search</button>
				  		<div style={this.getLoadingStyle()}><Loader/></div>
				  	</div>
			  	</form>
			  	<div id="map" className="map-data-container" ref="map"></div>
			</div>
		);
	}
}