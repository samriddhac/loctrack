const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const pub = require('redis-connection')();
const sub = require('redis-connection')('subscriber');
const events = require('./EventConstants');

app.get('/', function(req, res){
  res.send({
  	status:"OK"
  });
});

let allconnections = [];
let subscribedconnections = [];

io.on('connection', function(socket){
	console.log('connection');
	allconnections.push(socket);
	socket.on(events.EVENT_CONNECTION_ESTABLISHED, (from, data)=>{
		
	});  
	socket.on(events.EVENT_ESTABLISH_CHANNEL, (from, data)=>{
		
	});
	socket.on(events.EVENT_REQUEST_SUBSCRIPTION, (from, data)=>{
		let dataObj = JSON.parse(data);
		console.log(dataObj);
		subscribedconnections.push({
			channel:dataObj.to,
			websocket:socket
		});
		sub.subscribe(dataObj.to);
	});
	socket.on(events.EVENT_STOP_SUBSCRIPTION, (from, data)=>{
		
	});
	socket.on(events.EVENT_ALLOW_SUBSCRIPTION, (from, data)=>{
		
	});
	socket.on(events.EVENT_DENY_SUBSCRIPTION, (from, data)=>{
		
	});
	socket.on(events.EVENT_PUBLISH_LOCATION, (from, data)=>{
		console.log(events.EVENT_PUBLISH_LOCATION, data);
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
			item.websocket.emit(channel, message);
		}
	});
});
http.listen(7000, function(){
  console.log('listening on *:7000');
});