'use strict';
const environment = require('env2')('.env');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const pub = require('redis-connection')();
const sub = require('redis-connection')('subscriber');
const _ = require('lodash');
const events = require('./event-constants');
const socketpool = require('./websocket-pool');
const util = require('./util');
const request = require('request');
var AsyncLock = require('async-lock');
const uuidv1 = require('uuid/v1');

var lock = new AsyncLock({timeout : 5000});
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
			logEmits(events.EVENT_ON_MESSAGE_RECEIVE, from, {id:from,t:events.TYPE_CONN_ACK});
			releasePendingQueue(from);
		}
		catch(err) {
			console.log(err);
		}
	});
	socket.on(events.EVENT_ACK_PENDING_QUEUE, (from, data)=>{
		try {
			console.log(events.EVENT_ACK_PENDING_QUEUE, ' received from ', from, 'data ', data);
			Object.keys(pendingmessages).forEach(function(key) {
				let pendingQueue = pendingmessages[key];
				if(pendingQueue!==undefined && pendingQueue!==null
					&& pendingQueue.length>0) {
					let index = -1;
					let i =0;
					pendingQueue.forEach((item)=>{
						if(item.data!==undefined && item.data!==null
							&& item.data.id!==undefined && item.data.id!==null) {
							if(data.id === item.data.id) {
								index = i;
							}
						}
						i++;
					});
					if(index>=0) {
						console.log('pending queue ',pendingQueue.length);
						pendingQueue.splice(index, 1);
						console.log('pending queue ',pendingQueue.length);
					}
				}
			});
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
			console.log(events.EVENT_ESTABLISH_AUTH, ' received from ', from, 'data ', data);
			pub.set(from, JSON.stringify(obj));
			obj.t = events.TYPE_AUTH_VALIDATE;
			socket.emit(events.EVENT_ON_MESSAGE_RECEIVE, from, obj);
			logEmits(events.EVENT_ON_MESSAGE_RECEIVE, from, obj);
		}
		catch(err) {
			console.log(err);
		}
	});
	socket.on(events.EVENT_ESTABLISH_AUTH_SUCCESS, (from, data)=>{
		try {
			console.log(events.EVENT_ESTABLISH_AUTH_SUCCESS, ' received from ', from, 'data ', data);
			lock.acquire(from, (done)=>{
				pub.get(from, (err, data)=>{
					if(!util.isEmpty(err)) {
						console.log('EVENT_ESTABLISH_AUTH_SUCCESS ', err);
					}
					else {
						if(!util.isEmpty(data)) {
							let obj = JSON.parse(data);
							obj.auth  = {isAuth: true};
							pub.set(from, JSON.stringify(obj));
							obj.t = events.TYPE_ACK;
							socket.emit(events.EVENT_ON_MESSAGE_RECEIVE, from, obj);
							logEmits(events.EVENT_ON_MESSAGE_RECEIVE, from, obj);
						}
						else {
							dataRetrieveFailure(from, socket);
						}
					}
				});
				done();
			},(err, ret)=>{
				console.log('lock err ',err);
			});
		}
		catch(err) {
			console.log(err);
		}
	});
	socket.on(events.EVENT_SET_FCM_TOKEN, (from, tokenObj)=>{
		try {
			console.log(events.EVENT_SET_FCM_TOKEN, ' received from ', from, 'data ', tokenObj);
			let tokenObject = JSON.parse(tokenObj);
			lock.acquire(from, (done)=>{
				pub.get(from, (err, data)=>{
					if(!util.isEmpty(err)) {
						console.log('EVENT_SET_FCM_TOKEN ', err);
					}
					else {
						if(!util.isEmpty(data)) {
							let fromItem = JSON.parse(data);
							fromItem.fcm_token  = tokenObject.token;
							pub.set(from, JSON.stringify(fromItem));
							socket.emit(events.EVENT_ON_MESSAGE_RECEIVE, from, {t:events.TYPE_ACK});
							logEmits(events.EVENT_ON_MESSAGE_RECEIVE, from, {t:events.TYPE_ACK});
						}
						else {
							dataRetrieveFailure(from, socket);
						}
					}
				});
				done();
			},(err, ret)=>{
				console.log('lock err ',err);
			});
		}
		catch(err) {
			console.log(err);
		}
	});
	socket.on(events.EVENT_ESTABLISH_AUTH_FAILURE, (from, data)=>{
		try {
			console.log(events.EVENT_ESTABLISH_AUTH_FAILURE, ' received from ', from, 'data ', data);
			lock.acquire(from, (done)=>{
				pub.get(from, (err, data)=>{
					if(!util.isEmpty(err)) {
						console.log('EVENT_ESTABLISH_AUTH_FAILURE ', err);
						dataRetrieveFailure(from);
					}
					else {
						if(!util.isEmpty(data)) {
							let obj = JSON.parse(data);
							obj.auth  = {isAuth: false};
							pub.set(from, JSON.stringify(obj));
							obj.t = events.TYPE_ACK;
							socket.emit(events.EVENT_ON_MESSAGE_RECEIVE, from, obj);
							logEmits(events.EVENT_ON_MESSAGE_RECEIVE, from, obj);
						}
						else {
							dataRetrieveFailure(from, socket);
						}
					}
				});
				done();
			},(err, ret)=>{
				console.log('lock err ',err);
			});
		}
		catch(err) {
			console.log(err);
		}
	});
	socket.on(events.EVENT_SHARE_REQUEST, (from, data)=>{
		try {
			console.log(events.EVENT_SHARE_REQUEST, ' received from ', from, 'data ', data);
			let objList = JSON.parse(data);
			if(objList!==undefined && objList!==null
			&& objList.length>0) {
				objList.forEach((toObj)=>{
					let to = toObj.to;
					lock.acquire(to, (cb)=>{
						pub.get(to, (err, data)=>{
							if(!util.isEmpty(err)) {
								console.log('EVENT_REQUEST_SUBSCRIPTION ', err);
							}
							else {
								if(!util.isEmpty(data)) {
									let toItem = JSON.parse(data);
									let toWebsocket = socketpool.getConnectionByID(to);
									let id = uuidv1();
									if(toWebsocket!==undefined && toWebsocket!==null) {
										let toSocketId = toWebsocket.websocket;
										socket.broadcast.to(toSocketId).emit(events.EVENT_ON_MESSAGE_RECEIVE, to, 
											{id, from:from, t:events.TYPE_SHARE_REQ});
										logEmits(events.EVENT_ON_MESSAGE_RECEIVE, from, {id, from:from, t:events.TYPE_SHARE_REQ});
										socket.emit(events.EVENT_ON_MESSAGE_RECEIVE, from, 
												{t:events.TYPE_ACK});
										logEmits(events.EVENT_ON_MESSAGE_RECEIVE, from, {t:events.TYPE_ACK});
									}
									else {
										(pendingmessages[to] = pendingmessages[to] || []).push({
											event:events.EVENT_ON_MESSAGE_RECEIVE,
											from: to,
											data: {id, from:from, t:events.TYPE_SHARE_REQ}
										});
										socket.emit(events.EVENT_ON_MESSAGE_RECEIVE, from, 
												{t:events.TYPE_NA});
										logEmits(events.EVENT_ON_MESSAGE_RECEIVE, from, {t:events.TYPE_NA});
									}
									if(toItem.fcm_token!==undefined && toItem.fcm_token!==null) {
										sendFcmNotification(toItem.fcm_token, {
											title: events.NF_TITLE,
											message: events.NF_SHAREREQUEST
										});
									}
								}
								else {
									dataRetrieveFailure(to, socket);
								}
							}
							cb();
						});
					}, (err, ret)=>{});
					
				});
			}
		}
		catch(err) {
			console.log(err);
		}
	});
	socket.on(events.EVENT_REQUEST_SUBSCRIPTION, (from, data)=>{
		try {
			console.log(events.EVENT_REQUEST_SUBSCRIPTION, ' received from ', from, 'data ', data);
			let objList = JSON.parse(data);
			lock.acquire(from, (done)=>{
				pub.get(from, (err, data)=>{
					if(!util.isEmpty(err)) {
						console.log('EVENT_REQUEST_SUBSCRIPTION ', err);
					}
					else {
						if(!util.isEmpty(data)) {
							let fromItem = JSON.parse(data);
							if(objList!==undefined && objList!==null
							&& objList.length>0) {
								objList.forEach((toObj)=>{
									let to = toObj.to;
									_.remove(fromItem.sub, {id:to});
									fromItem.sub.push({id:to, s:events.STATUS_PENDING});
									lock.acquire(to, (cb)=>{
										pub.get(to, (err, data)=>{
											if(!util.isEmpty(err)) {
												console.log('EVENT_REQUEST_SUBSCRIPTION ', err);
											}
											else {
												if(!util.isEmpty(data)) {
													let toItem = JSON.parse(data);
													let toWebsocket = socketpool.getConnectionByID(to);
													let id = uuidv1();
													if(toWebsocket!==undefined && toWebsocket!==null) {
														let toSocketId = toWebsocket.websocket;
														socket.broadcast.to(toSocketId).emit(events.EVENT_ON_MESSAGE_RECEIVE, to, 
															{id, from:from, t:events.TYPE_SUB_REQ});
														logEmits(events.EVENT_ON_MESSAGE_RECEIVE, from, {id, from:from, t:events.TYPE_SUB_REQ});
														socket.emit(events.EVENT_ON_MESSAGE_RECEIVE, from, 
																{t:events.TYPE_ACK});
														logEmits(events.EVENT_ON_MESSAGE_RECEIVE, from, {t:events.TYPE_ACK});
													}
													else {
														(pendingmessages[to] = pendingmessages[to] || []).push({
															event:events.EVENT_ON_MESSAGE_RECEIVE,
															from: to,
															data: {id, from:from, t:events.TYPE_SUB_REQ}
														});
														socket.emit(events.EVENT_ON_MESSAGE_RECEIVE, from, 
																{t:events.TYPE_NA});
														logEmits(events.EVENT_ON_MESSAGE_RECEIVE, from, {t:events.TYPE_NA});
													}
													if(toItem.fcm_token!==undefined && toItem.fcm_token!==null) {
														sendFcmNotification(toItem.fcm_token, {
															title: events.NF_TITLE,
															message: events.NF_SUBREQMSG
														});
													}
													_.remove(toItem.pub, {id:from});
													toItem.pub.push({id:from, s:events.STATUS_PENDING});
													pub.set(to, JSON.stringify(toItem));
												}
												else {
													dataRetrieveFailure(to, socket);
												}
											}
										});
										cb();
									}, (err, ret)=>{done();});
								});
							}
							pub.set(from, JSON.stringify(fromItem));
						}
						else {
							dataRetrieveFailure(from, socket);
						}
					}
				});
				done();
			}, (err, ret)=>{
				console.log('lock err ',err);
			});
		}
		catch(err) {
			console.log(err);
		}
	});
	socket.on(events.EVENT_REQUEST_SUBSCRIPTION_REJECTED, (from, data)=>{
		try {
			console.log(events.EVENT_REQUEST_SUBSCRIPTION_REJECTED, ' received from ', from, 'data ', data);
			let toObj = JSON.parse(data);
			let to = toObj.to;
			lock.acquire(from, (done)=>{
				pub.get(from, (err, data)=>{
					if(!util.isEmpty(err)) {
						console.log('EVENT_REQUEST_SUBSCRIPTION_REJECTED ', err);
					}
					else {
						if(!util.isEmpty(data)) {
							let fromItem = JSON.parse(data);
							_.remove(fromItem.pub, {id:to});
							fromItem.pub.push({id:to, s:events.STATUS_REJECTED});
							pub.set(from, JSON.stringify(fromItem));
							lock.acquire(to, (cb)=>{
								pub.get(to, (err, data)=>{
									if(!util.isEmpty(err)) {
										console.log('EVENT_REQUEST_SUBSCRIPTION_REJECTED ', err);
									}
									else {
										if(!util.isEmpty(data)) {
											let toItem = JSON.parse(data);
											_.remove(toItem.sub, {id:from});
											toItem.sub.push({id:from, s:events.STATUS_REJECTED});
											let toWebsocket = socketpool.getConnectionByID(to);
											let id = uuidv1();
											if(toWebsocket!==undefined && toWebsocket!==null) {
												let toSocketId = toWebsocket.websocket;
												socket.broadcast.to(toSocketId).emit(events.EVENT_ON_MESSAGE_RECEIVE, from, 
													{id, t:events.TYPE_SUB_REQ_DENIED});
												logEmits(events.EVENT_ON_MESSAGE_RECEIVE, from, {id, t:events.TYPE_SUB_REQ_DENIED});
											}
											else {
												(pendingmessages[to] = pendingmessages[to] || []).push({
													event:events.EVENT_ON_MESSAGE_RECEIVE,
													from: from,
													data: {id, t:events.TYPE_SUB_REQ_DENIED}
												});
											}
											pub.set(to, JSON.stringify(toItem));									
											socket.emit(events.EVENT_ON_MESSAGE_RECEIVE, from, {t:events.TYPE_ACK});
											logEmits(events.EVENT_ON_MESSAGE_RECEIVE, from, {t:events.TYPE_ACK});
											if(toItem.fcm_token!==undefined && toItem.fcm_token!==null) {
												sendFcmNotification(toItem.fcm_token, {
													title: events.NF_TITLE,
													message: events.NF_SUBREQREJMSG
												});
											}
										}
										else {
											dataRetrieveFailure(to, socket);
										}
									}
								});
								cb();
							},(err, ret)=>{
								console.log('lock err ',err);
							});			
						}
						else {
							dataRetrieveFailure(from, socket);
						}
					}
				});
				done();	
			},(err, ret)=>{
				console.log('lock err ',err);
			});
		}
		catch(err) {
			console.log(err);
		}
	});
	socket.on(events.EVENT_REQUEST_SUBSCRIPTION_ACCEPTED, (from, data)=>{
		try {
			console.log(events.EVENT_REQUEST_SUBSCRIPTION_ACCEPTED, ' received from ', from, 'data ', data);
			let toObj = JSON.parse(data);
			console.log(toObj, from);
			let to = toObj.to;
			lock.acquire(from, (done)=>{
				pub.get(from, (err, data)=>{
					if(!util.isEmpty(err)) {
						console.log('EVENT_REQUEST_SUBSCRIPTION_ACCEPTED ', err);
					}
					else {
						if(!util.isEmpty(data)) {
							let fromItem = JSON.parse(data);
							_.remove(fromItem.pub, {id:to});
							fromItem.pub.push({id:to, s:events.STATUS_APPROVED});
							pub.set(from, JSON.stringify(fromItem));
							lock.acquire(to, (cb)=>{
								pub.get(to, (err, data)=>{
									if(!util.isEmpty(err)) {
										console.log('EVENT_REQUEST_SUBSCRIPTION_ACCEPTED ', err);
									}
									else {
										if(!util.isEmpty(data)) {
											let toItem = JSON.parse(data);
											_.remove(toItem.sub, {id:from});
											toItem.sub.push({id:from, s:events.STATUS_APPROVED});
											let toWebsocket = socketpool.getConnectionByID(to);
											let id = uuidv1();
											if(toWebsocket!==undefined && toWebsocket!==null) {
												let toSocketId = toWebsocket.websocket;
												socket.broadcast.to(toSocketId).emit(events.EVENT_ON_MESSAGE_RECEIVE, from, 
													{id, t:events.TYPE_SUB_REQ_APPROVED});
												logEmits(events.EVENT_ON_MESSAGE_RECEIVE, from, {id, t:events.TYPE_SUB_REQ_APPROVED});
											}
											else {
												(pendingmessages[to] = pendingmessages[to] || []).push({
													event:events.EVENT_ON_MESSAGE_RECEIVE,
													from: from,
													data: {id, t:events.TYPE_SUB_REQ_APPROVED}
												});
											}
											pub.set(to, JSON.stringify(toItem));
											socket.emit(events.EVENT_ON_MESSAGE_RECEIVE, from, {t:events.TYPE_ACK});
											logEmits(events.EVENT_ON_MESSAGE_RECEIVE, from, {t:events.TYPE_ACK});
											if(toItem.fcm_token!==undefined && toItem.fcm_token!==null) {
												sendFcmNotification(toItem.fcm_token, {
													title: events.NF_TITLE,
													message: events.NF_SUBREQAPRMSG
												});
											}
										}
										else {
											dataRetrieveFailure(to, socket);
										}
									}
								});
								sub.subscribe(from);
								cb();
							},(err, ret)=>{
								console.log('lock err ',err);
							});
						}
						else {
							dataRetrieveFailure(from, socket);
						}
					}
					done();
				});
			},(err, ret)=>{
				console.log('lock err ',err);
			});
		}
		catch(err) {
			console.log(err);
		}
	});
	socket.on(events.EVENT_PUBLISH_LOCATION, (from, data)=>{
		try {
			console.log(events.EVENT_PUBLISH_LOCATION, ' received from ', from, 'data ', data);
			pub.publish(from, data);
		}
		catch(err) {
			console.log(err);
		}
	});
	socket.on(events.EVENT_ADD_TO_PUBLISH, (from, data)=>{
		try {
			console.log(events.EVENT_ADD_TO_PUBLISH, ' received from ', from, 'data ', data);
			let objList = JSON.parse(data);
			lock.acquire(from, (done)=>{
				pub.get(from, (err, data)=>{
					if(!util.isEmpty(err)) {
						console.log('EVENT_REQUEST_SUBSCRIPTION ', err);
					}
					else {
						if(!util.isEmpty(data)) {
							let fromItem = JSON.parse(data);
							if(objList!==undefined && objList!==null
							&& objList.length>0) {
								objList.forEach((toObj)=>{
									let to = toObj.to;
									_.remove(fromItem.pub, {id:to});
									fromItem.pub.push({id:to, s:events.STATUS_APPROVED});
									lock.acquire(to, (cb)=>{
										pub.get(to, (err, data)=>{
											if(!util.isEmpty(err)) {
												console.log('EVENT_ADD_TO_PUBLISH ', err);
											}
											else {
												if(!util.isEmpty(data)) {
													let toItem = JSON.parse(data);
													_.remove(toItem.sub, {id:from});
													toItem.sub.push({id:from, s:events.STATUS_APPROVED});
													let id = uuidv1();
													let toWebsocket = socketpool.getConnectionByID(to);
													if(toWebsocket!==undefined && toWebsocket!==null) {
														let toSocketId = toWebsocket.websocket;
														socket.broadcast.to(toSocketId).emit(events.EVENT_ON_MESSAGE_RECEIVE, from, 
															{id, t:events.TYPE_SUB_REQ_APPROVED});
														logEmits(events.EVENT_ON_MESSAGE_RECEIVE, from, {id, t:events.TYPE_SUB_REQ_APPROVED});
													}
													else {
														(pendingmessages[to] = pendingmessages[to] || []).push({
															event:events.EVENT_ON_MESSAGE_RECEIVE,
															from: from,
															data: {id, t:events.TYPE_SUB_REQ_APPROVED}
														});
													}
													pub.set(to, JSON.stringify(toItem));
													socket.emit(events.EVENT_ON_MESSAGE_RECEIVE, from, {t:events.TYPE_ACK});
													logEmits(events.EVENT_ON_MESSAGE_RECEIVE, from, {t:events.TYPE_ACK});
													if(toItem.fcm_token!==undefined && toItem.fcm_token!==null) {
														sendFcmNotification(toItem.fcm_token, {
															title: events.NF_TITLE,
															message: events.NF_SUBREQPUBAPRMSG
														});
													}
												}
												else {
													dataRetrieveFailure(to, socket);
												}
											}
											cb();
										});
									}, (err, ret)=>{});
								});
							}
							sub.subscribe(from);
							pub.set(from, JSON.stringify(fromItem));
						}
						else {
							dataRetrieveFailure(from, socket);
						}
					}
					done();
				});
			}, (err, ret)=>{});
		}
		catch(err) {
			console.log(err.stack);
		}
	});
	
	socket.on(events.EVENT_STOP_SUBSCRIPTION, (from, data)=>{
		try {
			console.log(events.EVENT_STOP_SUBSCRIPTION, ' received from ', from, 'data ', data);
			let toObj = JSON.parse(data);
			console.log(toObj, from);
			let to = toObj.to;
			lock.acquire(from, (done)=>{
				pub.get(from, (err, data)=>{
					if(!util.isEmpty(err)) {
						console.log('EVENT_STOP_SUBSCRIPTION ', err);
					}
					else {
						if(!util.isEmpty(data)) {
							let fromItem = JSON.parse(data);
							_.remove(fromItem.sub, {id:to});
							pub.set(from, JSON.stringify(fromItem));
							lock.acquire(to, (cb)=>{
								pub.get(to, (err, data)=>{
									if(!util.isEmpty(err)) {
										console.log('EVENT_STOP_SUBSCRIPTION ', err);
									}
									else {
										if(!util.isEmpty(data)) {
											let toItem = JSON.parse(data);
											_.remove(toItem.pub, {id:from});
											let id = uuidv1();
											let toWebsocket = socketpool.getConnectionByID(to);
											if(toWebsocket!==undefined && toWebsocket!==null) {
												let toSocketId = toWebsocket.websocket;
												socket.broadcast.to(toSocketId).emit(events.EVENT_ON_MESSAGE_RECEIVE, from, 
													{id, t:events.TYPE_PUB_REQ_REMOVED});
												logEmits(events.EVENT_ON_MESSAGE_RECEIVE, from, {id, t:events.TYPE_PUB_REQ_REMOVED});

											}
											else {
												(pendingmessages[to] = pendingmessages[to] || []).push({
													event:events.EVENT_ON_MESSAGE_RECEIVE,
													from: from,
													data: {id, t:events.TYPE_PUB_REQ_REMOVED}
												});
											}
											pub.set(to, JSON.stringify(toItem));
											socket.emit(events.EVENT_ON_MESSAGE_RECEIVE, from, {t:events.TYPE_ACK});
											logEmits(events.EVENT_ON_MESSAGE_RECEIVE, from, {t:events.TYPE_ACK});
										}
										else {
											dataRetrieveFailure(to, socket);
										}
									}
								});
								cb();
							},(err, ret)=>{
								console.log('lock err ',err);
							});
						}
						else {
							dataRetrieveFailure(from, socket);
						}
					}
				});
				done();
			},(err, ret)=>{
				console.log('lock err ',err);
			});
		}
		catch(err) {
			console.log(err);
		}
	});
	socket.on(events.EVENT_REMOVE_PUBLISH, (from, data)=>{
		try {
			console.log(events.EVENT_REMOVE_PUBLISH, ' received from ', from, 'data ', data);
			let toObj = JSON.parse(data);
			console.log(toObj, from);
			let to = toObj.to;
			lock.acquire(from, (done)=>{
				pub.get(from, (err, data)=>{
					if(!util.isEmpty(err)) {
						console.log('EVENT_REMOVE_PUBLISH ', err);
					}
					else {
						if(!util.isEmpty(data)) {
							let fromItem = JSON.parse(data);
							_.remove(fromItem.pub, {id:to});
							pub.set(from, JSON.stringify(fromItem));
							lock.acquire(from, (cb)=>{
								pub.get(to, (err, data)=>{
									if(!util.isEmpty(err)) {
										console.log('EVENT_REMOVE_PUBLISH ', err);
									}
									else {
										if(!util.isEmpty(data)) {
											let toItem = JSON.parse(data);
											_.remove(toItem.sub, {id:from});
											let id = uuidv1();
											let toWebsocket = socketpool.getConnectionByID(to);
											if(toWebsocket!==undefined && toWebsocket!==null) {
												let toSocketId = toWebsocket.websocket;
												socket.broadcast.to(toSocketId).emit(events.EVENT_ON_MESSAGE_RECEIVE, from, 
													{id, t:events.TYPE_SUB_REQ_REMOVED});
												logEmits(events.EVENT_ON_MESSAGE_RECEIVE, from, {id, t:events.TYPE_SUB_REQ_REMOVED});
											}
											else {
												(pendingmessages[to] = pendingmessages[to] || []).push({
													event:events.EVENT_ON_MESSAGE_RECEIVE,
													from: from,
													data: {id, t:events.TYPE_SUB_REQ_REMOVED}
												});
											}
											pub.set(to, JSON.stringify(toItem));
											socket.emit(events.EVENT_ON_MESSAGE_RECEIVE, {t:events.TYPE_ACK});
											logEmits(events.EVENT_ON_MESSAGE_RECEIVE, from, {t:events.TYPE_ACK});
										}
										else {
											dataRetrieveFailure(to, socket);
										}
									}
								});
								cb();
							},(err, ret)=>{
								console.log('lock err ',err);
							});							
						}
						else {
							dataRetrieveFailure(from, socket);
						}
					}
				});
				done();
			},(err, ret)=>{
				console.log('lock err ',err);
			});
		}
		catch(err) {
			console.log(err);
		}
	});
	socket.on(events.DISCONNECT, ()=>{
		try {
			console.log('Disconnecting socket ', socket.id);
			socketpool.removeFromPoolBySocket(socket.id);
			console.log('socketpool ',socketpool.getAllConnection().length);
		}
		catch(err) {	
			console.log(err);
		}
	});
});

sub.on(events.EVENT_ON_MESSAGE_RECEIVE, (channel, message)=>{
	console.log(events.EVENT_ON_MESSAGE_RECEIVE, ' Received for channel',channel, 'data ',message);
	try{
		pub.get(channel, (err, data)=>{
			if(!util.isEmpty(err)) {
				console.log('SUBS EVENT_ON_MESSAGE_RECEIVE ', err);
			}
			else {
				if(!util.isEmpty(data)) {
					let fromItem = JSON.parse(data);
					let approvedSubList = [];
					if(fromItem!==undefined && fromItem!==null 
						&& fromItem.pub!==undefined && fromItem.pub!==null
						&& fromItem.pub.length>0) {
						fromItem.pub.forEach((item)=>{
							if(item.s!==undefined && item.s!==null
								&& item.s === events.STATUS_APPROVED) {
								approvedSubList.push(item);
							}
						});
					}
					if(approvedSubList!==undefined && approvedSubList!==null
						&& approvedSubList.length>0) {
						let locObj = JSON.parse(message);
						if(locObj.selected!==undefined && locObj.selected!==null
							&& locObj.selected.length>0) {
							locObj.selected.forEach((sel)=>{
								console.log('selected channels ',sel);
								approvedSubList.forEach((item)=>{
									if(item.id === sel) {
										let websocket = socketpool.getConnectionByID(item.id);
										if(websocket!==undefined && websocket!==null
											&& websocket.socket!==undefined
											&& websocket.socket!==null) {
											let obj = {
												t:locObj.t,
												data: locObj.data
											};
											websocket.socket.emit(events.EVENT_ON_MESSAGE_RECEIVE, channel, obj);
											logEmits(events.EVENT_ON_MESSAGE_RECEIVE, channel, item.id);
										}
									}
								});
							});
						}
						else {
							approvedSubList.forEach((item)=>{
								let websocket = socketpool.getConnectionByID(item.id);
								if(websocket!==undefined && websocket!==null
									&& websocket.socket!==undefined
									&& websocket.socket!==null) {
									let obj = {
										t:locObj.t,
										data: locObj.data
									};
									websocket.socket.emit(events.EVENT_ON_MESSAGE_RECEIVE, channel, obj);
									logEmits(events.EVENT_ON_MESSAGE_RECEIVE, channel, item.id);
								}
							});
						}
					}
				}
				else {
					dataRetrieveFailure(channel);
				}
			}
		});
	}
	catch(err) {
		console.log(err);
	}
});

function sendFcmNotification(token, data) {
	console.log('Sending fcm notification to ',token);
	let jsonData = {
		data:{
			ticker: "WhereApp notification",
		    autoCancel: true,
		    largeIcon: "ic_launcher",
		    smallIcon: "ic_notification",
		    bigText: data.message,
		    subText: "WhereApp notification",
		    title: data.title,
		    message: data.message		},
		to:token
	};
	let key = "key=AIzaSyBukdNUWqz7yju4w33N_qxx7VxBYrAxWyc";
	request({
	    url: "https://fcm.googleapis.com/fcm/send",
	    method: "POST",
	    headers: {
        	"Content-Type":"application/json",
        	"Authorization":key
    	},
	    json: true,
	    body: jsonData
	}, function (error, response, body){
	    console.log('fcm error ', error);
	});

}

function releasePendingQueue(to) {
	try{
		console.log('Releasing pending queue for ', to);
		if(pendingmessages!==undefined && pendingmessages!==null) {
			if(pendingmessages[to]!==undefined && pendingmessages[to]!==null
				&& pendingmessages[to].length>0) {
				let websocket = socketpool.getConnectionByID(to);
				pendingmessages[to].forEach((obj)=>{
					if(websocket!==undefined && websocket!==null) {
						websocket.socket.emit(obj.event, obj.from, obj.data);
						logEmits(obj.event, obj.from, obj.data);
					}
				});
			}
		}
	}
	catch(err) {
		console.log(err);
	}
}

function dataRetrieveFailure(id, socket) {
	console.log('Failed to retrive data for id ', id);
	if(socket!==undefined && socket!==null) {
		socket.emit(events.EVENT_ON_MESSAGE_RECEIVE, null, {id:id, t:events.TYPE_NR});
		logEmits(events.EVENT_ON_MESSAGE_RECEIVE, null, {id:id, t:events.TYPE_NR});
	}
}

function logEmits(event, from, data) {
	console.log('Emitting event ', event, 'from ', from, 'data ', data);
}

http.listen(7000, function(){
  console.log('listening on *:7000');
});