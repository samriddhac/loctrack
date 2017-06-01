'use strict';

function websocket_pool() {
	let webSocketPool =[];

	return {

		addToPool: function(conn) {
			if(webSocketPool!==undefined && webSocketPool!==null) {
				if(webSocketPool.length === 0 ) {
					webSocketPool.push(conn);
				}
				else {
					let exists = false;
					webSocketPool.forEach((item)=>{
						if(item.id ==conn.id) {
							exists = true;
						}
					});
					if(!exists) {
						webSocketPool.push(conn);
					}
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
		getConnectionByID: function(id) {
			let selectedConnection = {};
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
		getAllConnection: function() {
			return webSocketPool;
		},
		removeAllConnection() {
			webSocketPool =[];
		}

	}
}

module.exports = new websocket_pool();