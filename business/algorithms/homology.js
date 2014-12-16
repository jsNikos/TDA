/**
 * Runs as forked child-process
 */
var _ = require('underscore');
var Algorithm = require('./Algorithm');
module.exports = new Homology();

function Homology(){
	var scope = this;
	// inheritance
	Algorithm.call(this);
	
}