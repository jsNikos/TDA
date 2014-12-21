module.exports = Algorithm;

/**
 * This is the abstract class for an algorithm.
 * Implement this in order to obtain an fully recognized algorithm.
 * In general algorithm are intended to compute something on given data and to return a result.
 * The code always must be executed in a separate forked child-process.
 * Use algorithmService to execute an algorithm.
 */
function Algorithm(){
	var scope = this;
	
	function init(){
		// register message-listener for this child-process
		// command: {method: string, data: object, options: object}
		process.on('message', function(args) {
			scope[args.method].call(this, args);
		});	
	}
	
	/**
	 * This is called to start computation. 
	 * The 'args' must contain data and options.
	 * Preferred is this structure: {data: ... , options: {...}}
	 * @returns: the result, in case sendResult-function exists in scope,
	 * is calling this additionally (this enables to run as forked-process).
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
	
	init();
}