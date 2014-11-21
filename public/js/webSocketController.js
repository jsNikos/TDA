define(['EventEmitter'], function(EventEmitter){	
	
	/**
	 * Initializes a websocket-connection to server and emits events when receiving message.
	 * Lets registers event-listeners for specific broadcast channels.
	 * The message from serve is expected to be {channel: string, detail: object, data: object}
	 */
	WebSocketController.prototype = new EventEmitter();
	WebSocketController.prototype.constructor = WebSocketController;
	function WebSocketController(){
		var scope = this;
		var webSocket = undefined;		
		
		// events
		var message = 'message';
		
		/**
		 * Intializes the websocket. 
		 * @param callback : function(err), called when ready 
		 */
		this.init = function(options, callback){
			callback = callback || function() {};
			webSocket = new WebSocket('ws://' + location.host);
			webSocket.onopen = function(event) {
				callback(null);
			};
			webSocket.onerror = function(err) {
				callback(err);
			};
			webSocket.onmessage = function(event) {
				scope.fire(message, JSON.parse(event.data));				
			};
		};	
		
	}
	
	return new WebSocketController();
	
});