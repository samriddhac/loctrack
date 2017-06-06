'use strict';
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const pub = require('redis-connection')();
const sub = require('redis-connection')('subscriber');
const _ = require('lodash');
const events = require('./event-constants');
const socketpool = require('./websocket-pool');
const util = require('./util');

var counter = 0;

app.get('/', function(req, res){
  res.send({
  	status:"OK"
  });
});

var subscribedconnections = [];
var pendingmessages = {};


io.on(events.CONNECTION, function(socket){

	console.log('Received connection request ', ++counter+' socket id ',socket.id);

	socket.on(events.EVENT_CONNECTION_ESTABLISHED, (from, data)=>{
		try {
			socketpool.addToPool({id:from, websocket:socket.id, socket:socket});
			console.log('Connection received from ', from, 'socket id ', socket.id);
			socket.emit(events.EVENT_ON_MESSAGE_RECEIVE, from, {id:from,t:events.TYPE_CONN_ACK});
			releasePendingQueue(from);
		}
		catch(err) {
			console.log(err);
		}
	});

	socket.on(events.EVENT_ESTABLISH_AUTH, (from, data)=>{
		try {
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
			obj.t = events.TYPE_AUTH_VALIDATE;
			socket.emit(events.EVENT_ON_MESSAGE_RECEIVE, from, obj);
		}
		catch(err) {
			console.log(err);
		}
	});

	socket.on(events.EVENT_ESTABLISH_AUTH_SUCCESS, (from, data)=>{
		try {
			pub.get(from, (err, data)=>{
				if(!util.isEmpty(err)) {
					console.log('EVENT_ESTABLISH_AUTH_SUCCESS ', err);
				}
				else {
					if(!util.isEmpty(data)) {
						let obj = JSON.parse(data);
						obj.auth  = {isAuth: true};
						obj.t = events.TYPE_ACK;
						socket.emit(events.EVENT_ON_MESSAGE_RECEIVE, from, obj);
					}
				}
			});
		}
		catch(err) {
			console.log(err);
		}
	});

	socket.on(events.EVENT_ESTABLISH_AUTH_FAILURE, (from, data)=>{
		try {
			pub.get(from, (err, data)=>{
				if(!util.isEmpty(err)) {
					console.log('EVENT_ESTABLISH_AUTH_FAILURE ', err);
				}
				else {
					if(!util.isEmpty(data)) {
						let obj = JSON.parse(data);
						obj.auth  = {isAuth: false};
						obj.t = events.TYPE_ACK;
						socket.emit(events.EVENT_ON_MESSAGE_RECEIVE, from, obj);
					}
				}
			});
		}
		catch(err) {
			console.log(err);
		}
	});

	socket.on(events.EVENT_REQUEST_SUBSCRIPTION, (from, data)=>{
		try {
			let toObj = JSON.parse(data);
			let to = toObj.to;
			pub.get(from, (err, data)=>{
				if(!util.isEmpty(err)) {
					console.log('EVENT_REQUEST_SUBSCRIPTION ', err);
				}
				else {
					if(!util.isEmpty(data)) {
						let fromItem = JSON.parse(data);
						pub.get(to, (err, data)=>{
							if(!util.isEmpty(err)) {
								console.log('EVENT_REQUEST_SUBSCRIPTION ', err);
							}
							else {
								if(!util.isEmpty(data)) {
									let toItem = JSON.parse(data);
									_.remove(fromItem.sub, {id:to});
									fromItem.sub.push({id:to, s:events.STATUS_PENDING});
									let toWebsocket = socketpool.getConnectionByID(to);
									if(toWebsocket!==undefined && toWebsocket!==null) {
										let toSocketId = toWebsocket.websocket;
										socket.broadcast.to(toSocketId).emit(events.EVENT_ON_MESSAGE_RECEIVE, to, 
											{from:from, t:events.TYPE_SUB_REQ});
										socket.emit(events.EVENT_ON_MESSAGE_RECEIVE, from, 
												{t:events.TYPE_ACK});
										_.remove(toItem.pub, {id:from});
										toItem.pub.push({id:from, s:events.STATUS_PENDING});
									}
									else {
										(pendingmessages[to] = pendingmessages[to] || []).push({
											event:events.EVENT_ON_MESSAGE_RECEIVE,
											from: to,
											data: {from:from, t:events.TYPE_SUB_REQ}
										});
										socket.emit(events.EVENT_ON_MESSAGE_RECEIVE, from, 
												{t:events.TYPE_NA});
									}
									pub.set(to, JSON.stringify(toItem));
									pub.set(from, JSON.stringify(fromItem));
								}
							}
						});
					}
				}
			});
		}
		catch(err) {
			console.log(err);
		}
	});

	socket.on(events.EVENT_REQUEST_SUBSCRIPTION_REJECTED, (from, data)=>{
		try {
			let toObj = JSON.parse(data);
			let to = toObj.to;
			pub.get(from, (err, data)=>{
				if(!util.isEmpty(err)) {
					console.log('EVENT_REQUEST_SUBSCRIPTION_REJECTED ', err);
				}
				else {
					if(!util.isEmpty(data)) {
						let fromItem = JSON.parse(data);
						pub.get(to, (err, data)=>{
							if(!util.isEmpty(err)) {
								console.log('EVENT_REQUEST_SUBSCRIPTION_REJECTED ', err);
							}
							else {
								if(!util.isEmpty(data)) {
									let toItem = JSON.parse(data);
									_.remove(toItem.sub, {id:from});
									toItem.sub.push({id:from, s:events.STATUS_REJECTED});
									_.remove(fromItem.pub, {id:to});
									fromItem.pub.push({id:to, s:events.STATUS_REJECTED});
									let toWebsocket = socketpool.getConnectionByID(to);
									console.log('toWebsocket ',toWebsocket);
									if(toWebsocket!==undefined && toWebsocket!==null) {
										let toSocketId = toWebsocket.websocket;
										socket.broadcast.to(toSocketId).emit(events.EVENT_ON_MESSAGE_RECEIVE, from, 
											{t:events.TYPE_SUB_REQ_DENIED});
									}
									else {
										(pendingmessages[to] = pendingmessages[to] || []).push({
											event:events.EVENT_ON_MESSAGE_RECEIVE,
											from: from,
											data: {t:events.TYPE_SUB_REQ_DENIED}
										});
									}
									pub.set(to, JSON.stringify(toItem));
									pub.set(from, JSON.stringify(fromItem));
									socket.emit(events.EVENT_ON_MESSAGE_RECEIVE, {t:events.TYPE_ACK});
								}
							}
						});
					}
				}
			});
		}
		catch(err) {
			console.log(err);
		}
	});

	socket.on(events.EVENT_REQUEST_SUBSCRIPTION_ACCEPTED, (from, data)=>{
		try {
			let toObj = JSON.parse(data);
			console.log(toObj, from);
			let to = toObj.to;
			pub.get(from, (err, data)=>{
				if(!util.isEmpty(err)) {
					console.log('EVENT_REQUEST_SUBSCRIPTION_REJECTED ', err);
				}
				else {
					if(!util.isEmpty(data)) {
						let fromItem = JSON.parse(data);
						pub.get(to, (err, data)=>{
							if(!util.isEmpty(err)) {
								console.log('EVENT_REQUEST_SUBSCRIPTION_REJECTED ', err);
							}
							else {
								if(!util.isEmpty(data)) {
									let toItem = JSON.parse(data);
									_.remove(toItem.sub, {id:from});
									toItem.sub.push({id:from, s:events.STATUS_APPROVED});
									_.remove(fromItem.pub, {id:to});
									fromItem.pub.push({id:to, s:events.STATUS_APPROVED});
									let toWebsocket = socketpool.getConnectionByID(to);
									if(toWebsocket!==undefined && toWebsocket!==null) {
										let toSocketId = toWebsocket.websocket;
										socket.broadcast.to(toSocketId).emit(events.EVENT_ON_MESSAGE_RECEIVE, from, 
											{t:events.TYPE_SUB_REQ_APPROVED});
										sub.subscribe(from, to);
									}
									else {
										(pendingmessages[to] = pendingmessages[to] || []).push({
											event:events.EVENT_ON_MESSAGE_RECEIVE,
											from: from,
											data: {t:events.TYPE_SUB_REQ_APPROVED}
										});
									}
									pub.set(to, JSON.stringify(toItem));
									pub.set(from, JSON.stringify(fromItem));
									socket.emit(events.EVENT_ON_MESSAGE_RECEIVE, {t:events.TYPE_ACK});
								}
							}
						});
					}
				}
			});
		}
		catch(err) {
			console.log(err);
		}
	});

	socket.on(events.EVENT_PUBLISH_LOCATION, (from, data)=>{
		pub.publish(from, data);
	});

	
	socket.on(events.EVENT_STOP_SUBSCRIPTION, (from, data)=>{
		
	});
	
	socket.on(events.EVENT_STOP_PUBLISH, (from, data)=>{
		console.log(events.EVENT_STOP_PUBLISH, from);
	});

	socket.on(events.DISCONNECT, ()=>{
		console.log('Disconnecting socket ', socket.id);
		socketpool.removeFromPoolBySocket(socket.id);
		console.log('socketpool ',socketpool);
	});
});

sub.on(events.EVENT_ON_MESSAGE_RECEIVE, (channel, message)=>{
	console.log(channel);
	console.log(message);
	pub.get(channel, (err, data)=>{
		if(!util.isEmpty(err)) {
			console.log('SUBS EVENT_ON_MESSAGE_RECEIVE ', err);
		}
		else {
			if(!util.isEmpty(data)) {
				let fromItem = JSON.parse(data);
				let approvedSubList = [];
				if(fromItem!==undefined && fromItem!==null 
					&& fromItem.sub!==undefined && fromItem.sub!==null
					&& fromItem.sub.length>0) {
					fromItem.sub.forEach((item)=>{
						if(item.s!==undefined && item.s!==null
							&& item.s === events.STATUS_APPROVED) {
							approvedSubList.push(item);
						}
					});
				}
				if(approvedSubList!==undefined && approvedSubList!==null
					&& approvedSubList.length>0) {
					approvedSubList.forEach((item)=>{
						let websocket = socketpool.getConnectionByID(to);
						if(websocket!==undefined && websocket!==null) {
							message.t = events.TYPE_LOC;
							websocket.socket.emit(events.EVENT_ON_MESSAGE_RECEIVE, channel, message);
						}
					});
				}
			}
		}
	});
});

function releasePendingQueue(to) {
	console.log(pendingmessages);
	if(pendingmessages!==undefined && pendingmessages!==null) {
		if(pendingmessages[to]!==undefined && pendingmessages[to]!==null
			&& pendingmessages[to].length>0) {
			let websocket = socketpool.getConnectionByID(to);
			pendingmessages[to].forEach((obj)=>{
				if(websocket!==undefined && websocket!==null) {
					websocket.socket.emit(obj.event, obj.from, obj.data);
				}
			});
			pendingmessages[to] = [];
		}
	}
}

http.listen(7000, function(){
  console.log('listening on *:7000');
});