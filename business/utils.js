var _ = require('underscore');
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
	
}