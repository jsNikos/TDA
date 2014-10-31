var utils = require('./utils');
var _ = require('underscore');
module.exports = new Broadcaster();

function Broadcaster(){	
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
	 */
	this.send = function(msg){
		_.chain(connections).each(function(connection){
			connection.sendUTF(msg);
		});
	};
}

