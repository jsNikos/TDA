module.exports = Algorithm;

/**
 * This is the abstract class for an algorithm.
 * Implement this in order to obtain an fully recognized algorithm.
 * In general algorithm are intended to compute something on given data and to return a result.
 * The code is always executed in a separate forked child-process.
 * Use algorithmService to execute an algorithm.
 */
function Algorithm(){
	
	/**
	 * This is called to start computation. 
	 * The 'args' must contain data and options.
	 */
	this.start = function(args){
		throw new Error('this is abstract');		
	};	
		
	
	/**
	 * This is called in order to stop a running algorithm.
	 */
	this.stop = function(){
		throw new Error('this is abstract');
	};
	
	/**
	 * Use this to send the result back to parent-process when algorithm has finished.
	 * @param result
	 */
	this.sendResult = function(result){
		process.send(result); 
	};
}