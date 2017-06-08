'use strict';
const _ = require('lodash');

function websocket_pool() {
	let webSocketPool =[];
	return {

		addToPool: function(conn) {
			if(webSocketPool!==undefined && webSocketPool!==null) {
				if(webSocketPool.length === 0 ) {
					webSocketPool.push(conn);
				}
				else {
					let index = 0;
					let counter = -1;
					webSocketPool.forEach((item)=>{
						index++;
						if(item.id ==conn.id) {
							counter = index;
						}
					});
					if(counter>-1) {
						webSocketPool = webSocketPool.splice(counter, 1);
					}
					webSocketPool.push(conn);
				}
			}
		},
		removeFromPool: function(conn) {
			if(webSocketPool!==undefined && webSocketPool!==null) {
				if(webSocketPool.length !== 0 ){
					let matchIndex = -1;
					for(let index=0; index<webSocketPool.length; index++) {
						let item = webSocketPool[index];
						if(item.id ==conn.id) {
							matchIndex = index;
						}
					}
					if(matchIndex>0) {
						webSocketPool.splice(matchIndex, 1);
					}
				}
			}
		},
		removeFromPoolBySocket: function(socketId) {
			if(webSocketPool!==undefined && webSocketPool!==null) {
				if(webSocketPool.length > 0 ){
					let matchIndex = -1;
					for(let index=0; index<webSocketPool.length; index++) {
						let item = webSocketPool[index];
						if(item.websocket ==socketId) {
							matchIndex = index;
						}
					}
					if(matchIndex>0) {
						_.remove(webSocketPool, {websocket:socketId});
					}
				}
			}
		},
		getConnectionByID: function(id) {
			let selectedConnection = undefined;
			if(webSocketPool!==undefined && webSocketPool!==null
				&& webSocketPool.length !== 0) {
				webSocketPool.forEach((item)=>{
					if(item.id ==id) {
						selectedConnection = item;
					}
				});
			}
			return selectedConnection;
		},
		removeAllConnection(webSocketPool) {
			webSocketPool =[];
		},
		getAllConnection() {
			return webSocketPool;
		}
	}
}

module.exports = new websocket_pool();