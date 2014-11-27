define([ './SimulationsContentView', 'BaseContentController',
         'async', 'handleError', 'utils', 'webSocketController'],
function(SimulationsContentView, BaseContentController, async,
		handleError, utils, webSocketController) {
	return function(args){
		SimulationsContentController.prototype = new BaseContentController(args);
		SimulationsContentController.prototype.constructor = SimulationsContentController;
		return new SimulationsContentController(args);
	};
	// events

	function SimulationsContentController(args) {
		var scope = this;
		var urlPrefix = '/simulations';
		
		// models
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
		
		
		this.init = function() {	
			async.series([
			       scope.initPageViewTask(SimulationsContentView),
			       utils.asTask(scope.fireReady),
			       utils.asTask(subscribeToSimulationResults)
			], function(err){
				err && handleError(err);
			});					
		};
		
		function subscribeToSimulationResults(){
			webSocketController.on('message', handleSimulationResult);
		}
		
		function handleSimulationResult(args){
			if(!args.channel === 'simulation-result'){
				return;
			}
			scope.view.renderResult(args.data);
		}
		
		
		
		
		/**
		 * Requests from server to start simulation.
		 */
		this.handleStartClicked =function() {
			jQuery.ajax({url:urlPrefix+'/start',
				type: 'POST'
			});
		};

		/**
		 * Requests from server to stop simulation.
		 */
		this.handleStopClicked =function() {
			jQuery.ajax({url:urlPrefix+'/stop',
				type: 'POST'
			});
		};	
		
	
	}	
});