/**
 * Runs as forked child-process
 */
var _ = require('underscore');
module.exports = new Logistic();

/**
 * Sends after each iteration step message to parent-process with result as data.
 */
function Logistic(){
	var scope = this;
	var task = {stop: function(){}, // call to stop task
			onIterationStep: function(){} // called when step has finished, called with result as argument
	};
	
	function init(){
		// register message-listener for this child-process
		process.on('message', function(func) {
			scope[func].call(this);
		});	
	}
	
	/**
	 * @override
	 */
	this.targetFunc = function(item){
		var prev = item.y;
		if(item.n === 0){
			prev = item.x;
		}				
		var result = _.extend({}, item);
		result.y = 4*prev*(1-prev);
		result.n++;				
		return result; 
	};	

	/**
	 * TODO this goes into prototype
	 * @param args : {initValues : []}
	 */
	this.start = function(args){
		args = args || {};
		console.log(__filename + ' starting ...');
		if(!args.initValues){
			console.log(__filename + ' no init-values given. Applying default.');
			args.initValues = scope.createInitValues();
		}
		task = iterate(args);
		task.onIterationStep = function(result){
			process.send(result); 
		};
	};
	
	/**
	 * TODO abstract into prototype
	 */
	scope.createInitValues = function(){
		var values = [];			
		for(var i = 0; i < 200; i++){
			values.push({x : i/200, y : 0, n : 0, initValueId : i});				
		}
		return values;
	};

	/**
	 * TODO this goes into prototype
	 */
	this.stop = function(){
		console.log(__filename + ' stopping ...');	
		task && task.stop();
	};
	
	/**
	 * TODO goes into prototype
	 * Triggers the dynamic system given by func to be iterated.
	 * In each iteration the result of previous 'func'-call becomes the new argument.	
	 * @param args : {initValues: [item]}, init-values to apply on function
	 * @return task 
	 */
	function iterate(args){
		var stop = false;
		var task = {
			stop : function(){ stop = true; }			
		};		
				
		var results = args.initValues;
		function iterationLoop(){
			if(stop){return;}
			results = _.map(results, scope.targetFunc);
			task.onIterationStep && task.onIterationStep(results);
			setTimeout(iterationLoop, 0);
		}		
	
		setTimeout(iterationLoop, 0);
		return task;
	}	

	init();

}

