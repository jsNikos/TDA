var _ = require('underscore');
var assert = require('assert');
var PersistenceHomologyZ2 = require('./../../../business/algorithms/PersistenceHomologyZ2');

describe('PersistenceHomologyZ2', function(){	
	var persistenceHomologyZ2 = new PersistenceHomologyZ2();	
	
	describe('#start()', function(){
		it('should compute the persistence-homology over Z/Z2 for a filtered 2-simplex', function(done){
			var vertices = [{id:1, coord:[0,0]}, {id:2, coord:[1,0]}, {id:3, coord:[1,1]}];
			var simplexes = [{vertices: [1], dimension: 0, filterLevel: 0},
			                 {vertices: [2], dimension: 0, filterLevel: 0},
			                 {vertices: [3], dimension: 0, filterLevel: 0},
			                 {vertices: [3, 1, 2], dimension: 2, filterLevel: 3},
			                 {vertices: [1, 2], dimension: 1, filterLevel: 2},
			                 {vertices: [2, 3], dimension: 1, filterLevel: 1},
			                 {vertices: [1, 3], dimension: 1, filterLevel: 2}              
			                 ];
			
			var expectedBoundaryMatrix = [ [ , , ,  , 1 ,  1 ],
			                               [ , , , 1, 1],
			                               [ , , , 1,   ,  1 ],
			                               [ , , ,  ,   ,   , 1 ],
			                               [ , , ,  ,   ,   , 1 ],
			                               [ , , ,  ,   ,   , 1 ] ];
			
			var expectedBettyDiagrams = { '0': [ { start: 0, end: undefined },
			                                     { start: 0, end: 2 },
			                                     { start: 0, end: 1 } ],
			                              '1': [ , , , , , { start: 2, end: 3 } ] }; 
			
			persistenceHomologyZ2
			.start({data: {vertices: vertices, simplexes: simplexes}})
			.then(function(result){
				assert.deepEqual(result.boundaryMatrix, expectedBoundaryMatrix, 'the boundary matrix is not correct');
				assert.deepEqual(result.bettyDiagrams, expectedBettyDiagrams, 'the betty-diagrams are not correct');				
				done();
			})
			.done(null, done);

		});		
	});
	
});