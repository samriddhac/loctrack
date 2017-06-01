
let webSocketPool = [];

function websocket_pool() {
	this.webSocketPool =[];

	return {

		addToPool: function(conn) {
			if(this.webSocketPool!==undefined && this.webSocketPool!==null) {
				if(this.webSocketPool.length === 0 ) {
					this.webSocketPool.push(conn);
				}
				else {
					let exists = false;
					this.webSocketPool.forEach((item)=>{
						if(item.id ==conn.id) {
							exists = true;
						}
					});
					if(!exists) {
						this.webSocketPool.push(conn);
					}
				}
			}
			console.log('this.webSocketPool ',this.webSocketPool);
		},
		removeFromPool: function(conn) {
			if(this.webSocketPool!==undefined && this.webSocketPool!==null) {
				if(this.webSocketPool.length !== 0 ){
					let matchIndex = -1;
					for(let index=0; index<this.webSocketPool.length; index++) {
						let item = this.webSocketPool[index];
						if(item.id ==conn.id) {
							matchIndex = index;
						}
					}
					if(matchIndex>0) {
						this.webSocketPool.splice(matchIndex, 1);
					}
				}
			}
		},
		getConnectionByID: function(id) {
			if(this.webSocketPool!==undefined && this.webSocketPool!==null
				&& this.webSocketPool.length !== 0) {
				let selectedConnection = {};
				this.webSocketPool.forEach((item)=>{
					if(item.id ==conn.id) {
						selectedConnection = item;
					}
				});
			}
			return selectedConnection;
		},
		getAllConnection: function() {
			return this.webSocketPool;
		},
		removeAllConnection() {
			this.webSocketPool =[];
		}

	}
}

module.exports = new websocket_pool();