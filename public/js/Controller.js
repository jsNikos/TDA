define(['./View', './ChartView', 'async', 'backbone', 'bootstrap'], 
function(View, ChartView, async){
	return Controller;
	/**
	 * For simulation a dynamic system.
	 */
	function Controller(){
		var scope = this;
		var view = new View({controller: this});
		var chartView = new ChartView({controller: this});		
		
		var Result = Backbone.Model.extend({
			defaults : {
				x : 0,
				y : 0,
				z : 0,
				n : 0,  // iteration-step
				color: '#000000',
				initValueId : 0
			}
		});
		var Results = Backbone.Collection.extend({
			model: Result
		});		
		var results = new Results();
		
		function init(){
			initWebSocket();					
		}
		
		this.handleStartClicked =function() {
			jQuery.ajax({url:'/startSimulation',
				type: 'POST'
			});
		};

		this.handleStopClicked =function() {
			jQuery.ajax({url:'/stopSimulation',
				type: 'POST'
			});
		};
		
		/**
		 * Initializes websocket.
		 * @param callback: function(err, webSocket) - called when ready
		 */
		function initWebSocket(callback) {
			callback = callback || function() {
			};
			var webSocket = new WebSocket('ws://' + location.host);
			webSocket.onopen = function(event) {
				callback(null, webSocket);
			};
			webSocket.onerror = function(err) {
				callback(err);
			};
			webSocket.onmessage = function(event) {
				handleWebSocketMsg(event.data);
			};
		}
		
		function handleWebSocketMsg(results){
			setTimeout(function(){
				chartView.show(JSON.parse(results));
			}, 10);
		}		
		
		init();
	}
});