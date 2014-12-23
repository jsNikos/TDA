var _ = require('underscore');
var q = require('q');
module.exports = new Utils();

function Utils(){
	
	/**
	 * Removes elem from array.
	 */
	this.removeElement = function(array, elem){
		var idx = _.indexOf(array, elem);
		if(idx === -1){
			return;
		}
		array.splice(idx, 1);
		return this;
	};
	
	/**
	 * When executing many tasks (promises).
	 * The idea, is the 'next' returns either the next promise to execute or
	 * undefined in case queue is done.
	 * Advantage of this function, it doesn't burden the memory with promise-chain,
	 * each promise is built when executed.
	 * @param next : function, when called is require to return promise, or undefined to signal end of queue
	 * @returns promise, which is fulfilled when all task have run
	 */
	this.execTasks = function(next){
		return q.Promise(function(resolve, reject){
			iterate();
			
			function iterate(){
				var nextPromise = next();
				if(!nextPromise){					
					resolve();
				} else{
					nextPromise.then(function(){ iterate(); }, reject)
							   .done(null, reject);
				}
			}
		});
	};
	
}