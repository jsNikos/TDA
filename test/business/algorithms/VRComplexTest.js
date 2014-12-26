var _ = require('underscore');
var assert = require('assert');
var VRComplex = require('./../../../business/algorithms/VRComplex');

describe('VRComplex', function(){
	var vrComplex = new VRComplex();	
	
	describe('#start()', function(){
		it('should reconstruct the 2-dim complex from data-points', function(done){
			var data = [ [0,0], [1,0], [1,1], [2, 2] ];
			
			vrComplex
			.start({data: data, options: {maxScale: 1.5, maxDim: 2}})
			.then(function(result){
//				console.log(require('util').inspect(result, true, 10));				
				assert.notEqual(result.vertices, undefined, 'no vertices');
				assert.strictEqual(result.vertices.length, 4, 'must have 4 vertices');
				assert.notEqual(result.complex, undefined, 'no simplexes in complex');
				
				var dimToSimplexes = _.groupBy(result.complex, 'dimension');
				assert.strictEqual(dimToSimplexes[0].length, 4, 'must have 4 vertices');
				assert.strictEqual(dimToSimplexes[1].length, 4, 'must have 4 edges');
				assert.strictEqual(dimToSimplexes[2].length, 1, 'must have 1 2-simplex');
				assert.strictEqual(dimToSimplexes[3], undefined, 'must have 0 3-simplex');
				
				done();
			})
			.done(null, done);

		});
	});
	
	
	
});