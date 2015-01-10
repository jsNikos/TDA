var _ = require('underscore');
var assert = require('assert');
var PersistenceHomologyZ2 = require('./../../../business/algorithms/PersistenceHomologyZ2');

describe('PersistenceHomologyZ2', function(){	
	var persistenceHomologyZ2 = new PersistenceHomologyZ2();	
	
	describe('#start()', function(){
		it('should compute the persistence-homology over Z/Z2 for 2-simplex', function(done){
			var vertices = [{id:1, coord:[0,0]}, {id:2, coord:[1,0]}, {id:3, coord:[1,1]}];
			var simplexes = [{vertices: [1], dimension: 0, filterLevel: 0},
			                 {vertices: [2], dimension: 0, filterLevel: 0},
			                 {vertices: [3], dimension: 0, filterLevel: 0},
			                 {vertices: [3, 1, 2], dimension: 2, filterLevel: 2},
			                 {vertices: [1, 2], dimension: 1, filterLevel: 2},
			                 {vertices: [2, 3], dimension: 1, filterLevel: 1},
			                 {vertices: [1, 3], dimension: 1, filterLevel: 2}              
			                 ];
			
			persistenceHomologyZ2
			.start({data: {vertices: vertices, simplexes: simplexes}})
			.then(function(result){
//				for(var row = 0; row < simplexes.length; row++){
//					for(var col = 0; col < simplexes.length; col++){
//						result.matrix[row] &&
//						console.log(row+','+col+': '+result.matrix[row][col]);
//					}					
//				}
				
				console.log(require('util').inspect(result, {depth: null}));
//				assert.strictEqual(JSON.stringify(result), '[1,0]', 'H_0 = Z, n>0 H_n = 0');
				done();
			})
			.done(null, done);

		});
		

//		console.log(require('util').inspect(result, true, 10));
		
		
	});

	
	
	
});