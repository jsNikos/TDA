var utils = require('./utils');
var _ = require('underscore');
module.exports = new BroadcasterService();

function BroadcasterService(){	
	var scope = this;
	var connections = [];
	
	this.register = function(connection){		
		connections.push(connection);
		connection.on('close', function(){
			try{
				scope.unregister(connection);
			} catch(e){
				console.error(e.stack);	
			}
		});
	};
	
	this.unregister = function(connection){
		utils.removeElement(connections, connection);
	};
	
	/**
	 * Sends given message to all connections.
	 * @param channel : string
	 * @param detail : object
	 * @param data : object
	 */
	this.send = function(channel, detail, data){
		_.chain(connections).each(function(connection){
			connection.sendUTF(JSON.stringify({channel: channel, detail: detail, data: data}));
		});
	};
}

