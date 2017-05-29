'use strict';
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const pub = require('redis-connection')();
const sub = require('redis-connection')('subscriber');
const events = require('./event-constants');
const socketpool = require('./websocket-pool');


app.get('/', function(req, res){
  res.send({
  	status:"OK"
  });
});

let subscribedconnections = [];

io.on(events.CONNECTION, function(socket){
	console.log('Received connection request');

	socket.on(events.EVENT_CONNECTION_ESTABLISHED, (from, data)=>{
		socketpool.addToPool({id:from, websocket:socket});
		socket.emit(events.EVENT_ON_MESSAGE_RECEIVE, {id:from,t:events.TYPE_CONN_ACK});
	});

	socket.on(events.EVENT_ESTABLISH_AUTH, (from, data)=>{
		let obj = {
			id: from,
			sub:[],
			pub:[],
			auth: {
				isAuth: false,
				otp: "1235"
			}
		};
		pub.set(from, JSON.stringify(obj);
		let websocket = socketpool.getConnectionByID(from);
		websocket.emit(events.EVENT_ON_MESSAGE_RECEIVE, {...obj, t:events.TYPE_AUTH_VALIDATE});
	});

	socket.on(events.EVENT_ESTABLISH_AUTH_SUCCESS, (from, data)=>{
		let objString = pub.get(from);
		if(objString!==undefined && objString!==null) {
			let obj = JSON.parse(objString);
			obj  = {...obj, auth:{isAuth: true}};
			let websocket = socketpool.getConnectionByID(from);
			websocket.emit(events.EVENT_ON_MESSAGE_RECEIVE, {...obj, t:events.TYPE_ACK});
		}
	});

	socket.on(events.EVENT_ESTABLISH_AUTH_FAILURE, (from, data)=>{
		let objString = pub.get(from);
		if(objString!==undefined && objString!==null) {
			let obj = JSON.parse(objString);
			let websocket = socketpool.getConnectionByID(from);
			websocket.emit(events.EVENT_ON_MESSAGE_RECEIVE, {...obj, t:events.TYPE_ACK, auth:{isAuth: false}});
		}
	});

	socket.on(events.EVENT_REQUEST_SUBSCRIPTION, (from, data)=>{
		let toObj = JSON.parse(data);
		
		console.log(dataObj, from);
		subscribedconnections.push({
			channel:dataObj.to,
			websocket:socket
		});
		sub.subscribe(dataObj.to);
	});
	socket.on(events.EVENT_STOP_SUBSCRIPTION, (from, data)=>{
		
	});
	socket.on(events.EVENT_PUBLISH_LOCATION, (from, data)=>{
		pub.publish(from, data);
	});
	socket.on(events.EVENT_STOP_PUBLISH, (from, data)=>{
		console.log(events.EVENT_STOP_PUBLISH, from);
	});
});
sub.on(events.EVENT_ON_LOCATION_RECEIVE, (channel, message)=>{
	console.log(channel);
	console.log(message);
	subscribedconnections.forEach((item)=>{
		if(item.channel === channel) {
			item.websocket.emit(events.EVENT_ON_LOCATION_RECEIVE, message);
		}
	});
});
http.listen(7000, function(){
  console.log('listening on *:7000');
});