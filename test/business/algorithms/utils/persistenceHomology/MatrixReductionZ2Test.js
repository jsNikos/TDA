var _ = require('underscore');
var assert = require('assert');
var MatrixReduction = require('./../../../../../business/algorithms/utils/persistenceHomology/MatrixReductionZ2');

describe('MatrixReductionZ2 for persistence homology', function(){	
	var matrixReduction = new MatrixReduction();	
	
	describe('#start()', function(){
		it('should reduce the matrix over Z/Z2 as described in PersistenceHomologyZ2', function(){
			var data =  [ [ , , , ,1,1],
			              [ , , ,1,1],
			              [ , , ,1, ,1],
			              [ , , , , , ,1],
			              [ , , , , , ,1],
			              [ , , , , , ,1]];		
			
			var reduced = matrixReduction.start({data: data});
			var expected = [ [ , , ,  , 1,  ],
			                 [ , , , 1, 1,  ],
			                 [ , , , 1,  ,  ],
			                 [ , , ,  ,  ,  , 1 ],
			                 [ , , ,  ,  ,  , 1 ],
			                 [ , , ,  ,  ,  , 1 ] ];
			assert.deepEqual(reduced, expected, 'wrong reduced form');
		});		
		
	});	
	
});