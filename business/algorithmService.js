var cp = require('child_process');
var broadcaster = require('./broadcaster');
module.exports = new AlgorithmService();

/**
 * Utility-service which enables to run algorithms forked in child-processes.
 */
function AlgorithmService(){
	
	/**
	 * Forks a new child-process and runs given algorithm on given data and
	 * returns task.
	 * @param algorithmName: the file-name of the algorithm relative to algorithms-folder
	 * @param data : []
	 * @param options: configering the algorithm
	 * @param onReady: function(err, result)
	 * @returns task : {stop: function()}
	 */
	this.start = function(algorithmName, data, options, onReady){
		onReady = onReady || function(){};
//		var	algorithm = require(__dirname + '/algorithms/'+algorithmName); TODO 
//		algorithm.start({method: 'start', data: data, options: options}); 
		
		var	algorithm = cp.fork(__dirname + '/algorithms/'+algorithmName);
		algorithm
		  .on('message', function(msg) {
			try{				
				broadcaster.send('algorithm-result', {options: options, algorithm: algorithmName}, msg);
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
		algorithm.send({method: 'start', data: data, options: options});		
		
		return {
			stop: function(){
				algorithm.send({method: 'stop'});
			}			
		};
	};
	
	
	
}