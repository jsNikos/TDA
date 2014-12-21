/*
 * Intended to run in forked child-process always  
 */ 
module.exports = new AlgorithmMediator();

function AlgorithmMediator(){
	
	function init(){
		// register message-listener for this child-process
		// command: {method: string, data: object, options: object}
		process.on('message', function(args) {
			scope[args.method].call(this, args);
		});	
	}
}
