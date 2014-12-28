var _ = require('underscore');
var assert = require('assert');
var Homology = require('./../../../business/algorithms/HomologyZ2');

describe('HomologyZ2', function(){	
	var homology = new Homology();	
	
	describe('#start()', function(){
		it('should compute the homology over Z/Z2 for 1-simplex', function(done){
			var vertices = [{id:1, coord:[0,0]}, {id:2, coord:[1,0]}];
			var simplexes = [{vertices: [1], dimension: 0},
			                 {vertices: [2], dimension: 0},
			                 {vertices: [1, 2], dimension: 1}];
			
			homology
			.start({data: {vertices: vertices, simplexes: simplexes}})
			.then(function(result){
				assert.strictEqual(JSON.stringify(result), '[1,0]', 'H_0 = Z, n>0 H_n = 0');
				done();
			})
			.done(null, done);

		});
		
		it('should compute the homology over Z/Z2 for a 1-spere', function(done){
			var vertices = [{id:1, coord:[0,0]}, {id:2, coord:[1,0]}, {id:3, coord:[1,1]}];
			var simplexes = [{vertices: [1], dimension: 0},			                 
			                 {vertices: [2], dimension: 0},
			                 {vertices: [3], dimension: 0},
			                 {vertices: [1, 2], dimension: 1},
			                 {vertices: [2, 3], dimension: 1},
			                 {vertices: [1, 3], dimension: 1}];
			homology
			.start({data: {vertices: vertices, simplexes: simplexes}})
			.then(function(result){
//				console.log(require('util').inspect(result, true, 10));
				assert.strictEqual(JSON.stringify(result), '[1,1]', 'H_0=1, H_1=1');
				done();
			})
			.done(null, done);

		});
		
		
	});

	
	
	
});