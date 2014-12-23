var cp = require('child_process');
var broadcasterService = require('./broadcasterService');
module.exports = new AlgorithmService();

/**
 * Utility-service which enables to run algorithms forked in child-processes.
 */
function AlgorithmService(){
	
	/**
	 * Create instance of algorithm given by name.
	 */
	this.createAlgorithm = function(algorithmName){
		var Algorithm = require('./algorithms/'+algorithmName);
		return new Algorithm();
	};
	
	/**
	 * Forks a new child-process and runs given algorithm on given data and
	 * returns task.
	 * This method notifies broadcaster about results from algorithms!
	 * @param algorithmName: the file-name of the algorithm relative to algorithms-folder
	 * @param data : []
	 * @param options: configering the algorithm
	 * @param onReady: function(err, result)
	 * @returns task : {stop: function()}
	 */
	this.startAndBroadcast = function(algorithmName, data, options, onReady){
		onReady = onReady || function(){};
				
		var	algorithmMediator = cp.fork(__dirname + '/algorithms/AlgorithmMediator.js');
		algorithmMediator
		  .on('message', function(msg) {
			try{				
				broadcasterService.send('algorithm-result', {options: options, algorithm: algorithmName}, msg);
				onReady(null, msg);
			}catch(err){
				console.error(err.stack);				
			}})
		  .on('error', function(err){
			console.error(err.stack);
			onReady(err);
		   })
		  .on('exit', function(){
			  console.log(__filename + ' algorithm child-process exit');
		  });
		algorithmMediator.send({algorithm: algorithmName, method: 'start', data: data, options: options});		
		
		return {
			stop: function(){
				algorithmMediator.send({method: 'stop'});
			}			
		};
	};	
}