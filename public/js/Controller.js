define(['./View', 'async', 'backbone'], function(View, async){
	return Controller;
	/**
	 * For simulation a dynamic system.
	 */
	function Controller(){
		var scope = this;
		var view = new View({controller: this}); 
		
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
			var func = function(item){
				var prev = item.y;
				if(item.n === 0){
					prev = item.x;
				}				
				var result = _.extend({}, item);
				result.y = 4*prev*(1-prev);
				result.n++;				
				return result; 
			}
			iterate(60, createIterationStepTask(func), createInitValues(), onIterationReady);
		}
		
		function onIterationReady(){
			view.show(results);
		}
		
		function createInitValues(){
			var values = [];			
			for(var i = 0; i < 200; i++){
				values.push({x : i/200, y : 0, n : 0, initValueId : i});				
			}
			return values;
		}	
		
		/**
		 * Triggers the dynamic system given by func to be iterated with 'steps'-iterations.
		 * In each iteration the result of previous 'func'-call becomes the new argument.
		 * Fills the results-model.
		 * @param steps: max iteration steps
		 * @param iterationStepTask : function(item, callback(err, result))
		 * @param initValues: [item], init-values to apply on function
		 * @param onReady: called when iteration is done
		 */
		function iterate(steps, iterationStepTask, initValues, onReady){
			onReady = onReady || function(){};
			if(steps <= 0){
				onReady();
				return;
			}
			async.map(initValues, iterationStepTask, onStepReady); 				
			
			function onStepReady(err, values){
				if(err){
					console.error(err);
					throw new Error(err);
				}
				results.add(values); 
				iterate(steps-1, iterationStepTask, values, onReady);				
			}
		}	
		
		/**
		 * Creates iteration-step-task for given function.
		 */
		function createIterationStepTask(func){
			return function(item, callback){
				var err = undefined;
				var result = undefined;
				try{
					// catch only this, otherwise later calls on same run-stack are catched here too
					result = func.call(this, item);
				}catch(e){
					err = e;
				}
				callback(err, result);							
			}
		}
		
		init();
	}
});