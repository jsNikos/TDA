var _ = require('underscore');
var assert = require('assert');
var AlgorithmBaseAdaptor = require('./../../../business/algorithms/AlgorithmBaseAdaptor.js');

describe('AlgorithmBaseAdaptor', function(){	
	var algorithmBaseAdaptor = new AlgorithmBaseAdaptor();	
	
	describe('#request()', function(){
		it('should request execution of an external algorithm', function(done){		
			
			algorithmBaseAdaptor
			.request({url: 'http://localhost:6061', method: 'get'})
			.then(function(result){
				done();
			}, function(error){				
				assert.strictEqual(error.code, 'ECONNREFUSED', 'not expexted fail reason!');
			})
			.done(null, done);

		});
		
	});	
});