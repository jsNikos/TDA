var _ = require('underscore');
var assert = require('assert');
var MatrixReduction = require('./../../../../../business/algorithms/utils/persistenceHomology/MatrixReductionZ2');

describe('MatrixReductionZ2 for persistence homology', function(){	
	var matrixReduction = new MatrixReduction();	
	
	describe('#start()', function(){
		it('should reduce the matrix over Z/Z2', function(){
			var data =  [ [ , , , ,1,1],
			              [ , , ,1,1],
			              [ , , ,1, ,1],
			              [ , , , , , ,1],
			              [ , , , , , ,1],
			              [ , , , , , ,1]];		
			var reduced = matrixReduction.start({data: data});
			console.log(reduced);

//			console.log(require('util').inspect(result, true, 10));	
//			assert.notEqual(result.reduced, undefined, 'no reduced matrix');
//			assert.strictEqual(JSON.stringify(result.reduced), '[[1,0,0,0],[0,1,0,0],[0,0,1,0]]', 'wrong reduced form');
		});		
		
	});	
	
});