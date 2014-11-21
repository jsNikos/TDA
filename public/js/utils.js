define(function(){
	return new Utils();
	
	function Utils(){
		
		/**
		 * Creates a task for the given function, to be used in asyn-execution context.
		 * @param func - the function to be wrapped
		 * @param args - the args applied when called
		 * @param context - the context in which in will run
		 */
		this.asTask = function(func, args, context){
			return function(callback){			
				func.call(context || this, args);
				callback();
			};
		};
	}
});