module.exports = Algorithm;

/**
 * This is the abstract class for an algorithm.
 * Algorithm-instances never should store any state. They are opposed to be
 * run multiple-times.
 * Implement this in order to obtain an fully recognized algorithm.
 * In general algorithm are intended to compute something on given data and to return a result. 
 * Use algorithmService to execute an algorithm forked in a new child-process.
 */
function Algorithm(){
	var scope = this;	
	
	/**
	 * This is called to start computation. 
	 * The 'args' must contain data and options.
	 * Preferred is this structure: {data: ... , options: {...}}
	 * @returns: a promise containing the result
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
}