define([ './ComplexesContentView', 'BaseContentController',
         'async', 'handleError', 'utils', 'webSocketController'],
function(ComplexesContentView, BaseContentController, async,
		handleError, utils, webSocketController) {
	return function(args){
		ComplexesContentController.prototype = new BaseContentController(args);
		ComplexesContentController.prototype.constructor = ComplexesContentController;
		return new ComplexesContentController(args);
	};
	// events

	function ComplexesContentController(args) {
		var scope = this;
		var urlPrefix = '/complexes';
		
		// models		
				
		this.init = function() {
			async.series([
			       scope.initPageViewTask(ComplexesContentView),
			       utils.asTask(scope.fireReady),
			       utils.asTask(subscribeToComplexResults)
			], function(err){
				err && handleError(err);
			});					
		};
		
		function subscribeToComplexResults(){
			webSocketController.on('message', handleComplexResult);
		}
		
		/**
		 * Handles receiving a algorithm-outcome for creating a complex.
		 * Triggers view to render outcome.
		 * 
		 * This are all server-side definitions.
		 * Vertex: {id: number, coords: []}
		 * Simplex: {minScale: number, maxDistance: number, dimension: integer, id: integer, vertices: [vertex-id]} 
		 * @params args : {channel: string,
		 * 				    detail: {options: object, algorithm: string},
		 *                    data: {vertices:[Vertex], complex:[Simplex]}
		 *                }
		 * TODO save into client-db
		 */
		function handleComplexResult(args){
			if(!args.channel === 'algorithm-result'){
				return;
			}
			scope.view.renderResult(args);
		}		
		
		/**
		 * Requests from server to start simulation.
		 */
		this.handleStartClicked =function() {
			// TODO  some test data - add option to get from file, load from client-db, reference in server-db
			var data = [];		
			var iterations = 50;
			for(var i = 0; i <= iterations; i++){
				var ran = Math.random();
				data.push([Math.cos(2*Math.PI*ran), Math.sin(2*Math.PI*ran)]);
			}
			for(var i = 0; i <= iterations; i++){
				var ran = Math.random();
				data.push([0.8*Math.cos(2*Math.PI*ran), 0.8* Math.sin(2*Math.PI*ran)]);
			}			
			var request = {algorithm: 'vrComplex.js', data: data, options: {maxScale: 0.5, maxDim: 2}};
			
			jQuery.ajax({url: urlPrefix+'/start',
				type: 'POST',
				data: JSON.stringify(request),
				contentType: 'application/json'
			});
		};

		/**
		 * Requests from server to stop simulation.
		 */
		this.handleStopClicked =function() {
			jQuery.ajax({url: urlPrefix+'/stop',
				type: 'POST'
			});
		};	
		
	
	}	
});