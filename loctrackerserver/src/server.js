'use strict';
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const pub = require('redis-connection')();
const sub = require('redis-connection')('subscriber');
const _ = require('lodash');
const events = require('./event-constants');
const socketpool = require('./websocket-pool');

var counter = 0;

app.get('/', function(req, res){
  res.send({
  	status:"OK"
  });
});

var subscribedconnections = [];


io.on(events.CONNECTION, function(socket){

	console.log('Received connection request ', ++counter);

	socket.on(events.EVENT_CONNECTION_ESTABLISHED, (from, data)=>{
		console.log('Connection request from ', from);
		socketpool.addToPool({id:from, websocket:socket.id});
		let websocketId = socketpool.getConnectionByID(from);
		let wSocketId = websocketId.websocket;
		console.log(io.sockets.adapter.rooms);
		io.sockets.adapter.rooms[wSocketId].emit(events.EVENT_ON_MESSAGE_RECEIVE, from, {id:from,t:events.TYPE_CONN_ACK});
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
		pub.set(from, JSON.stringify(obj));
		let websocket = socketpool.getConnectionByID(from);
		console.log(websocket);
		if(websocket!==undefined) {
			obj.t = events.TYPE_AUTH_VALIDATE;
			websocket.emit(events.EVENT_ON_MESSAGE_RECEIVE, from, obj);
		}
	});

	socket.on(events.EVENT_ESTABLISH_AUTH_SUCCESS, (from, data)=>{
		let objString = pub.get(from);
		if(objString!==undefined && objString!==null) {
			let obj = JSON.parse(objString);
			obj.auth  = {isAuth: true};
			let websocket = socketpool.getConnectionByID(from);
			obj.t = events.TYPE_ACK;
			websocket.emit(events.EVENT_ON_MESSAGE_RECEIVE, from, obj);
		}
	});

	socket.on(events.EVENT_ESTABLISH_AUTH_FAILURE, (from, data)=>{
		let objString = pub.get(from);
		if(objString!==undefined && objString!==null) {
			let obj = JSON.parse(objString);
			let websocket = socketpool.getConnectionByID(from);
			obj.t = events.TYPE_ACK;
			obj.auth = {isAuth: false};
			websocket.emit(events.EVENT_ON_MESSAGE_RECEIVE, from, obj);
		}
	});

	socket.on(events.EVENT_REQUEST_SUBSCRIPTION, (from, data)=>{
		let toObj = JSON.parse(data);
		
		console.log(toObj, from);

		let to = toObj.to;
		let fromItemString = pub.get(from);
		let toItemString = pub.get(to);
		let fromItem = JSON.parse(fromItemString);
		let toItem = JSON.parse(toItemString);
		_.remove(fromItem.sub, {id:to});
		fromItem.sub.push({id:to, s:events.STATUS_PENDING});
		
		let toWebsocket = socketpool.getConnectionByID(to);
		let fromWebsocket = socketpool.getConnectionByID(from);
		if(toWebsocket!==undefined && toWebsocket!==null) {
			toWebsocket.emit(events.EVENT_ON_MESSAGE_RECEIVE, to, {from:from, t:events.TYPE_SUB_REQ});
			if(fromWebsocket!==undefined && fromWebsocket!==null) {
				fromWebsocket.emit(events.EVENT_ON_MESSAGE_RECEIVE, from, {t:events.TYPE_ACK});
			}
			_.remove(toItem.pub, {id:from});
			toItem.pub.push({id:from, s:events.STATUS_PENDING});
			pub.set(to, JSON.stringify(toItem));
		}
		else {
			if(fromWebsocket!==undefined && fromWebsocket!==null) {
				fromWebsocket.emit(events.EVENT_ON_MESSAGE_RECEIVE, from, {t:events.TYPE_NA});
			}
		}
		pub.set(from, JSON.stringify(fromItem));
	});

	socket.on(events.EVENT_REQUEST_SUBSCRIPTION_REJECTED, (from, data)=>{
		let toObj = JSON.parse(data);
		let to = toObj.to;
		let fromItemString = pub.get(from);
		let toItemString = pub.get(to);
		let fromItem = JSON.parse(fromItemString);
		let toItem = JSON.parse(toItemString);
		let toWebsocket = socketpool.getConnectionByID(to);
		let fromWebsocket = socketpool.getConnectionByID(from);
		
		_.remove(toItem.sub, {id:from});
		toItem.sub.push({id:from, s:events.STATUS_REJECTED});

		_.remove(fromItem.pub, {id:to});
		fromItem.pub.push({id:to, s:events.STATUS_REJECTED});
		
		if(toWebsocket!==undefined && toWebsocket!==null) {
			toWebsocket.emit(events.EVENT_ON_MESSAGE_RECEIVE, {t:events.TYPE_SUB_REQ_FAILURE});
		}
		if(fromWebsocket!==undefined && fromWebsocket!==null) {
			fromWebsocket.emit(events.EVENT_ON_MESSAGE_RECEIVE, {t:events.TYPE_ACK});
		}
	});

	socket.on(events.EVENT_REQUEST_SUBSCRIPTION_ACCEPTED, (from, data)=>{
		let toObj = JSON.parse(data);
		let to = toObj.to;
		let fromItemString = pub.get(from);
		let toItemString = pub.get(to);
		let fromItem = JSON.parse(fromItemString);
		let toItem = JSON.parse(toItemString);
		let toWebsocket = socketpool.getConnectionByID(to);
		let fromWebsocket = socketpool.getConnectionByID(from);
		_.remove(toItem.sub, {id:from});
		toItem.sub.push({id:from, s:events.STATUS_APPROVED});

		_.remove(fromItem.pub, {id:to});
		fromItem.pub.push({id:to, s:events.STATUS_APPROVED});
		if(toWebsocket!==undefined && toWebsocket!==null) {
			toWebsocket.emit(events.EVENT_ON_MESSAGE_RECEIVE, {t:events.TYPE_SUB_REQ_SUCCESS});
		}
		if(fromWebsocket!==undefined && fromWebsocket!==null) {
			fromWebsocket.emit(events.EVENT_ON_MESSAGE_RECEIVE, {t:events.TYPE_ACK});
		}
		sub.subscribe(from);
	});

	socket.on(events.EVENT_PUBLISH_LOCATION, (from, data)=>{
		pub.publish(from, data);
	});

	
	socket.on(events.EVENT_STOP_SUBSCRIPTION, (from, data)=>{
		subscribedconnections.push({
			channel:dataObj.to,
			websocket:socket
		});
		sub.subscribe(dataObj.to);
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