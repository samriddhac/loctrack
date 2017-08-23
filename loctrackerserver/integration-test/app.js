import React, { Component } from 'react';
import { Form, Text, Select, Textarea } from 'react-form';

import io from 'socket.io-client';

var socket = null;
const LOCATION_SERVER = 'http://52.25.44.165:7000';
function getSocket() {
	if(socket===null) {
		socket = io.connect(LOCATION_SERVER, {reconnect: true});
	}
	return socket;
}
getSocket().on('message', (from, data) => {
	console.log('Message received');
	console.log('From ', from);
	console.log('data ', data);
	if(data.id!==undefined)
		getSocket().emit('EVENT_ACK_PENDING_QUEUE', from, data.id);
});
export default class App extends Component {

	constructor(props) {
		super(props);
		this.firstUser = this.firstUser.bind(this);
		this.secondUser = this.secondUser.bind(this);
	}

	firstUser(values) {
		console.log('Success!', values);
		let o = {}
		if(values.type!==undefined && values.type!==null) {
			o.t = values.type;
		}
		if(values.to!==undefined && values.to!==null) {
			o.to = values.to;
		}
		if(values.data!==undefined && values.data!==null) {
			o.data = values.data;
		}
		if(values.events==='location') {
			this.sendLocation(values.to, parseFloat(values.lat), parseFloat(values.lng));
		}
		else {
			let str = JSON.stringify(o);
			if(values.events==='EVENT_REQUEST_SUBSCRIPTION' || values.events==='EVENT_ADD_TO_PUBLISH'
				|| values.events==='EVENT_SHARE_REQUEST') {
				let arr = [];
				arr.push(o);
				str = JSON.stringify(arr);
			}
			console.log('JSON.stringify(o) ',str);
			if(values.from!==undefined && values.from!==null) {
				getSocket().emit(values.events, values.from, str);
			}
			else {
				getSocket().emit(values.events, JSON.stringify(o));
			}
		}
	}
	sendLocation2() {
		let l = 0.001;
		let lat = 22.5691;
		let shareId = setInterval(()=>{
			console.log('Sending data');
			if(navigator && navigator.geolocation) {
				navigator.geolocation.getCurrentPosition((position) => {
					let currentCoord = {};
					currentCoord.lt = position.coords.latitude;
					currentCoord.lg = position.coords.longitude;

					let data = {
						latitude:lat,
						longitude:88.4090
					};
					let obj = {
						t:'loc',
						data:data
					};
					console.log(JSON.stringify(obj));
					getSocket().emit('EVENT_PUBLISH_LOCATION', '2', JSON.stringify(obj));
					lat = lat + l;
				});
			}
		}, 10000);
	}
	sendLocation(n, lat, lng) {
		let l = 0.001;
		let shareId = setInterval(()=>{
			console.log('Sending data');
			let data = {
				latitude:lat,
				longitude:lng
			};
			let obj = {
				t:'loc',
				data:data
			};
			console.log(JSON.stringify(obj));
			getSocket().emit('EVENT_PUBLISH_LOCATION', n, JSON.stringify(obj));
			lat = lat + l;
		}, 10000);
	}
	secondUser(values) {
		
	}
	render() {
		return (
			<div>
				<section>
					<legend> User 1 </legend>
					<Form
					    onSubmit={(values) => {
					      this.firstUser(values);
					    }}
					  >
					    {({submitForm}) => {
					      return (
					        <form onSubmit={submitForm}>
					          <span><label>From</label><Text field='from' /></span>
					          <span><label>To</label><Text field='to' /></span>
					          <span><label>lat</label><Text field='lat' /></span>
					          <span><label>lng</label><Text field='lng' /></span>
					          <Select // This is the built-in Select formInput 
					              field='events'
					              options={[{ // You can ship it some options like usual 
					                label: 'EVENT_CONNECTION_ESTABLISHED',
					                value: 'EVENT_CONNECTION_ESTABLISHED'
					              }, {
					                label: 'EVENT_ESTABLISH_AUTH',
					                value: 'EVENT_ESTABLISH_AUTH'
					              }, {
					                label: 'location',
					                value: 'location'
					              }, {
					                label: 'EVENT_ESTABLISH_AUTH_SUCCESS',
					                value: 'EVENT_ESTABLISH_AUTH_SUCCESS'
					              }, {
					                label: 'EVENT_ESTABLISH_AUTH_FAILURE',
					                value: 'EVENT_ESTABLISH_AUTH_FAILURE'
					              }, {
					                label: 'EVENT_REQUEST_SUBSCRIPTION',
					                value: 'EVENT_REQUEST_SUBSCRIPTION'
					              }, {
					                label: 'EVENT_REQUEST_SUBSCRIPTION_ACCEPTED',
					                value: 'EVENT_REQUEST_SUBSCRIPTION_ACCEPTED'
					              }, {
					                label: 'EVENT_REQUEST_SUBSCRIPTION_REJECTED',
					                value: 'EVENT_REQUEST_SUBSCRIPTION_REJECTED'
					              }, {
					                label: 'EVENT_STOP_SUBSCRIPTION',
					                value: 'EVENT_STOP_SUBSCRIPTION'
					              }, {
					                label: 'EVENT_PUBLISH_LOCATION',
					                value: 'EVENT_PUBLISH_LOCATION'
					              }, {
					                label: 'EVENT_STOP_PUBLISH',
					                value: 'EVENT_STOP_PUBLISH'
					              }, {
					                label: 'EVENT_REMOVE_PUBLISH',
					                value: 'EVENT_REMOVE_PUBLISH'
					              },{
					                label: 'EVENT_SHARE_REQUEST',
					                value: 'EVENT_SHARE_REQUEST'
					              }, {
					                label: 'EVENT_ADD_TO_PUBLISH',
					                value: 'EVENT_ADD_TO_PUBLISH'
					              }]}
					            />
					            <Select // This is the built-in Select formInput 
					              field='type'
					              options={[{ // You can ship it some options like usual 
					                label: 'conn_ack',
					                value: 'conn_ack'
					              }, {
					                label: 'ack',
					                value: 'ack'
					              }, {
					                label: 'auth_req',
					                value: 'auth_req'
					              }, {
					                label: 'auth_validate',
					                value: 'auth_validate'
					              }, {
					                label: 'auth_success',
					                value: 'auth_success'
					              }, {
					                label: 'auth_failure',
					                value: 'auth_failure'
					              }, {
					                label: 'sub_req',
					                value: 'sub_req'
					              }, {
					                label: 'sub_req_approved',
					                value: 'sub_req_approved'
					              }, {
					                label: 'sub_req_denied',
					                value: 'sub_req_denied'
					              }, {
					                label: 'sub_req_rem',
					                value: 'sub_req_rem'
					              }, {
					                label: 'pub_req_rem',
					                value: 'pub_req_rem'
					              }, {
					                label: 'na',
					                value: 'na'
					              }]}
					            />
					            <Textarea
								  field='data'
								  placeholder='Data'
								/>
					          <button type='submit'>Submit</button>
					          <button type='button' onClick={ (e)=> {
					          	this.sendLocation2();
					          }}>publish location</button>
					        </form>
					      )
					    }}
					  </Form>
				</section>
				<p/>
				<p/>
			</div>
		);
	}
}