var q = require('q');
var _ = require('underscore');
var Client = require('node-rest-client').Client;
var Algorithm = require('./Algorithm');

module.exports = AlgorithmBaseAdaptor;

/**
 * Provides base functionality to run an external algorithm and decorates
 * an Algorithm-instance.
 */
function AlgorithmBaseAdaptor(args){
	// inheritance
	Algorithm.call(this, args);
	
	
	/**
	 * Requests execution of external algorithm.
	 * @param args : {url: string,
	 * 				 method: string ('post', 'get'),
	 * 				 data:{test:"hello"}, // data passed to REST method (only useful in POST, PUT or PATCH methods)
     *               path:{"id":120}, // path substitution var used in http://remote.site/rest/json/${id}/method?arg1=${arg1}&arg2=${arg2}
     *         parameters: {arg1:"hello",arg2:"world"}, // query parameter substitution vars
	 */
	this.request = function(args){		
		return q.Promise(function(resolve, reject, notify){
			if(args.method !== 'get' && args.method !== 'post'){
				throw new Error('Not supported http request method: '+args.method);				
			} 
			var client = new Client();
			var clientArgs = _.extend({headers:{"Content-Type": "application/json"}}, _.pick(args, ['data', 'path', 'parameters']));
			var req = client[args.method](args.url, clientArgs, resolve);
			
			req.on('requestTimeout',function(req){	
			    reject('request timeout');
			});

			req.on('responseTimeout',function(res){
			    reject('response timeout');
			});
			
			req.on('error',function(err){
				reject(err);
			});
		});
	};	

	
}