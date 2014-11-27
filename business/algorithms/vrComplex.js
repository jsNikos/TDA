/**
 * Runs as forked child-process
 */
var _ = require('underscore');
var Algorithm = require('./Algorithm');
var sylvester = require('sylvester');

VRComplex.prototype = new Algorithm();
VRComplex.prototype.constructor = VRComplex;
module.exports = new VRComplex();

/**
 * When finishes normally, sends message to parent-process with result as data.
 * The result is of form {vertices, complex} whereas the complex is array of simplexes sorted
 * ascending w.r.t minScale (the minimum scale the simplex appearing in the complex).
 * 
 * General about the algorithm:
 * From given data tries to construct a Vietoris-Rips-Complex.
 * It is given a max-scale and a max-dimension.
 * Max-dimension determines what is the max-dimension of simplexes to construct.
 * First it starts by adding all data-points as vertices to the complex.
 * Then it iterates up in dimension.
 * To obtain for instance the 2-simplexes, it iterates for each 1-simplex through the vertices
 * and computes the maximal distance between vertices in the simplex obtained by adding the current
 * iterated vertex. In case this max-distance is below max-scale, the simplex is added to the complex.
 * The max-distance is saved as a property with the so constructed simplex and thus one can reproduce
 * the complex at any scale below max-scale by just selecting those which have max-distance below the
 * scale.
 * 
 * //TODO an alternative using in memory-db would be good to
 */
function VRComplex(){
	var scope = this;
	var Vertex = function(){
		this.id; // number
		this.coords; // [number], the coordinates
	};
	var Simplex = function(){
		this.id; // number
		this.minScale = 0; // number, the min scale which produces this simplex
		this.vertices; // [vertex.id]
		this.maxDistance = 0; // number, the max-distance between vertices
		this.dimension = 0; // number
	};
		
	function init(){
		// register message-listener for this child-process
		// command: {method: string, data: object, options: object}
		process.on('message', function(args) {
			scope[args.method].call(this, args);
		});	
	}

	/**
	 * @override
	 * @param args : {data: [[coords]], options: {maxScale: number, maxDim: number}}
	 */
	this.start = function(args){
		args = args || {};
		console.log(__filename + ' starting ...');	
		var vertices = createVertices(args.data);
		var complex = createComplex(args.options, vertices);
		complex = _.sortBy(complex, function(simplex){
			return simplex.minScale;
		});
		scope.sendResult({vertices: vertices, complex: complex});
	};	
	
	/**
	 * @param vertices: [vertex]
	 * @param options : {maxScale: number, maxDim: number}
	 * @returns [simplex]
	 */
	function createComplex(options, vertices){		
		var distanceMap = computeDistanceMap(vertices);	
		var complex = [];
		for(var dim = 0; dim <= options.maxDim; dim++){
			var simplexes =	extractDimension(dim, complex, vertices, distanceMap, options.maxScale);
			if(simplexes.length > 0){
				Array.prototype.push.apply(complex, simplexes);
			} else{
				break;
			}
		}		
		return complex;
	}
	
	/**
	 * Extracts given dimension from given complex.
	 * Iterates through simplexes of complex with dimension = dim-1
	 * and tries to create dim-dimensional simplex w.r.t given scale. 
	 * 
	 * The general idea of this algorithm is using the order defined in vertices.
	 * The algorithm iterates through dimensions in per dimension through vertixes contained in complex already.
	 * The order enables to proceed like here:
	 * assume dim=2 is done
	 * 
	 * check:
	 * [1 2] 3    add  [1 2 3]
	 * [1 2] 4    
	 * [1 2] 5    add [1 2 5]
	 * ...
	 * [5 2] x  we only need to check x > 5, because x < 5 can be ordered to obtained an already checked pair  
	 * 
	 * @param complex : [simplex]
	 * @return [simplex] : dim-dimensional simplexes
	 */
	function extractDimension(dim, complex, vertices, distanceMap, scale) {
		var result = [];
		if (dim === 0) {
			createDim0();
		} else if(dim === 1){
			createDim1();
		} else{
			createDim();
		}
		
		function createDim0(){
			_.each(vertices, function(vertex) {
				result.push(_.extend(new Simplex(), {
					id : vertex.id,
					vertices : [ vertex.id ]
				}));
			});		
		}
		
		function createDim1(){
			// get from distanceMap
			for(var id1 in distanceMap.map){
				id1 = parseInt(id1);
				for(id2 in distanceMap.map[id1]){
					id2 = parseInt(id2);
					var distance = distanceMap.map[id1][id2];
					if(distance <= scale){
						result.push(_.extend(new Simplex(), {
							minScale : distance,
							vertices : [id1, id2],
							maxDistance : distance,
							dimension : 1
						}));
					}					
				}
			}
		}
		
		function createDim(){
			_.each(complex, function(simplex){
				if(simplex.dimension !== dim-1){
					return;
				}
				for(var vertexId = Math.max.apply(null, simplex.vertices); vertexId < vertices.length; vertexId++){
					// checks are ordered, it's enough to check for higher vertex-ordinals
					var newSimplex = checkToCreateSimplex(simplex, vertices[vertexId], scale, distanceMap);
					newSimplex && result.push(newSimplex);
				}				
			});
		}		

		return result;
	}
	
	/**
	 * Checks to create simplex obtained from adjoining vertex to given simplex
	 * from complex in given scale.
	 * The criterion is that all distances between vertices keep lower than 'scale' and
	 * that given vertex is not already contained.
	 * @return simplex or null
	 */
	function checkToCreateSimplex(simplex, vertex, scale, distanceMap){
		if(_.contains(simplex.vertices, vertex.id)){
			return null;
		}
		
		var maxDistance = 0;
		for(var idx = 0; idx < simplex.vertices.length; idx++){
			maxDistance = Math.max(maxDistance, distanceMap(vertex.id, simplex.vertices[idx]));
			if(maxDistance > scale){
				return null;
			}
		}		
		
		return _.extend(new Simplex(), {
			minScale : maxDistance,
			vertices : simplex.vertices.concat(vertex.id),
			maxDistance : maxDistance,
			dimension : simplex.dimension + 1
		});
	}
	
	/**
	 * Computes the distance between all vertices.
	 * @param vertices : [vertex] must be ordered with resp. to id!
	 * @returns function(id1, id2){ return number}, function has prop 'map' to get raw-distanceMap
	 */
	function computeDistanceMap(vertices){
		var dist = {}; // {id1 : {id2 : number}} only store for id1 < id2
		var len = vertices.length;
		_.each(vertices.slice(0, vertices.length-1), function(vertex, idx1){			
			var curr = vertices[idx1];
			dist[curr.id] = {};
			for(var idx2 = idx1+1; idx2 < len; idx2++){
				comp = vertices[idx2];
				dist[curr.id][comp.id] = computeDistance(curr, comp);
			}
		});
		
		var wrapper = function(id1, id2){
			if(id1 === id2){
				return 0;
			}else if(id1 < id2){
				return dist[id1][id2];
			}else{
				return dist[id2][id1];
			}
		};
		wrapper.map = dist;		
		return wrapper;
	}
	
	/**
	 * Computing the distance between given vertices.
	 * Default to euclidean metric.
	 * @param vertex1
	 * @param vertex2
	 */
	function computeDistance(vertex1, vertex2){
		return $V(vertex1.coords).distanceFrom($V(vertex2.coords));
	}
	
	/**
	 * Extracts vertices from data.
	 * @return [vertex]
	 */
	function createVertices(data){
		return _.map(data, function(elem, idx){
			var vertex = new Vertex();			
			return _.extend(vertex, {id: idx, coords: elem});
		});
	}

	/**
	 * @override
	 */
	this.stop = function(){
		console.log(__filename + ' stopping ...');
		//TODO
	};
	
	

	init();

}

