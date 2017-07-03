import React, { Component } from 'react';
import { Form, Text, Select, Textarea } from 'react-form';

import io from 'socket.io-client';

var socket = null;
const LOCATION_SERVER = 'http://54.186.102.87:7000';
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
		console.log('JSON.stringify(o) ',JSON.stringify(o));
		if(values.from!==undefined && values.from!==null) {
			getSocket().emit(values.events, values.from, JSON.stringify(o));
		}
		else {
			getSocket().emit(values.events, JSON.stringify(o));
		}
		
	}
	sendLocation() {
		let l = 0.01;
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
					getSocket().emit('EVENT_PUBLISH_LOCATION', '1111111111', JSON.stringify(obj));
					lat = lat + l;
				});
			}
		}, 10000);
	}
	secondUser(values) {
		console.log('Success!', values);
		let o = {}
		if(values.type!==undefined && values.type!==null) {
			o.t = values.type;
		}
		if(values.to!==undefined && values.to!==null) {
			o.to = values.to;
		}
		if(values.from!==undefined && values.from!==null) {
			getSocket().emit(values.events, values.from, JSON.stringify(o));
		}
		else {
			getSocket().emit(values.events, JSON.stringify(o));
		}
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
					          <Select // This is the built-in Select formInput 
					              field='events'
					              options={[{ // You can ship it some options like usual 
					                label: 'EVENT_CONNECTION_ESTABLISHED',
					                value: 'EVENT_CONNECTION_ESTABLISHED'
					              }, {
					                label: 'EVENT_ESTABLISH_AUTH',
					                value: 'EVENT_ESTABLISH_AUTH'
					              }, {
					                label: 'message',
					                value: 'message'
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
					                label: 'EVENT_ON_LOCATION_RECEIVE',
					                value: 'EVENT_ON_LOCATION_RECEIVE'
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
					          	this.sendLocation();
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