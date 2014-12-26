var _ = require('underscore');
var assert = require('assert');
var MatrixReduction = require('./../../../business/algorithms/MatrixReductionZ2');

describe('MatrixReductionZ2', function(){	
	var matrixReduction = new MatrixReduction();	
	
	describe('#start()', function(){
		it('should reduce the matrix over Z/Z2', function(done){
			var data = [ [0,1,1,0], 
		                 [1,0,1,1],
		                 [1,0,0,0]];			
			matrixReduction
			.start({data: data})
			.then(function(result){
//				console.log(require('util').inspect(result, true, 10));	
				assert.notEqual(result.reduced, undefined, 'no reduced matrix');
				assert.strictEqual(JSON.stringify(result.reduced), '[[1,0,0,0],[0,1,0,0],[0,0,1,0]]', 'wrong reduced form');
				done();
			})
			.done(null, done);

		});
		
		it('should reduce the matrix over Z/Z2', function(done){
			var data = [ [0,1], 
		                 [1, 0],
		                 [1, 0] ];			
			matrixReduction
			.start({data: data})
			.then(function(result){
				assert.notEqual(result.reduced, undefined, 'no reduced matrix');
				assert.strictEqual(JSON.stringify(result.reduced), '[[1,0],[0,1],[0,0]]', 'wrong reduced form');
				done();
			})
			.done(null, done);

		});
		
		it('should reduce the matrix over Z/Z2', function(done){
			var data = [ [0,0,0,0], 
		                 [0, 0,0,1],
		                 [0, 0,0,1] ];			
			matrixReduction
			.start({data: data})
			.then(function(result){
				assert.notEqual(result.reduced, undefined, 'no reduced matrix');
				assert.strictEqual(JSON.stringify(result.reduced), '[[1,0,0,0],[0,0,0,0],[0,0,0,0]]', 'wrong reduced form');
				done();
			})
			.done(null, done);

		});
	});

	
	
	
});