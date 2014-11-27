var cp = require('child_process');
var broadcaster = require('./broadcaster');

module.exports = new SimulationService();

function SimulationService(){
	var simulation = undefined; // a forked child-process running a simulation

	/**
	 * Creates a new child process and start simulation.
	 */
	this.start = function(){
		simulation = cp.fork(__dirname + '/simulations/logistic.js');

		simulation
		  .on('message', function(msg) {
			try{								
				broadcaster.send('simulation-result', null, msg);
			}catch(err){
				console.error(err.stack);
			}})
		  .on('error', function(err){
			console.error(err.stack);
		   })
		  .on('exit', function(){
			  console.log(__filename + ' simulation child-process exit');
		  });

		simulation.send('start');
	};

	/**
	 * Triggers to stop simulation.
	 */
	this.stop = function(){
		simulation.send('stop');
		simulation.kill();		
		simulation = undefined;
	};




}