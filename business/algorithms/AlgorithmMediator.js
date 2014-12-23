/*
 * Intended to run in forked child-process always  
 */ 
module.exports = new AlgorithmMediator();

/**
 * This class provides mediator-service between an algorithm and the algorithmService.
 * Instance is wrapping one! algorithm instance. Thus it should be one of this instances
 * per algorithm instance!
 * It is required to be executed from the service within a new child-process.
 * - registers message-communication between the processes
 * - the instance always should be used in a new child-process
 * - listens on message to execute on an Algorithm (start,stop,...) or to create an algorithm-instance
 * - sends-back messages to service based on algorithm-events
 */
function AlgorithmMediator(){
	var algorithm = undefined; // wrapped instance	
	
	function init(){
		initMessages();
		// register message-listener for this child-process
		// command: {method: string, data: object, options: object}
		
	}
	
	/**
	 * Inits a message-listener to parent-process.
	 * Messages are required to be of form 
	 * {algorithm: string (the file-name of alg), method: string, data: object, options}
	 * and 'method' is invoked on algorithm-instance with delegating the arguments.
	 * For possible method-strings see Algorithm.js.
	 */
	function initMessages(){
		process.on('message', function(args) {
			if(args.method === 'start'){
				var Algorithm = require('./'+args.algorithm);
				algorithm = new Algorithm();
				algorithm.start(args).then(sendResult);
			} else{
				algorithm[args.method].call(this, args);
			}			
		});	
	}
	
	/**
	 * Sends the result back to parent-process when algorithm has finished.
	 * @param result
	 */
	function sendResult(result){
		process.send(result); 
	} 
	
	init();
}
