/**
 * Runs as forked child-process
 */
var _ = require('underscore');
var q = require('q');
var Algorithm = require('./Algorithm');

module.exports = MatrixReductionZ2;

/**
 * This algorithm is intended to reduce a matrix over the field Z/2Z into Smith normal form
 * (only 1 on a initial part of the diagonal).
 * It is used typically to compute the homology of a complex.
 */
function MatrixReductionZ2(){
	var scope = this;
	// inheritance
	Algorithm.call(this);
	
	/**
	 * This is called to start computation. 
	 * @param args : {data : [rows[columns]] - the matrix}
	 * @returns: promise with result: {reduced: [rows[columns]]}  reduced form
	 * @override
	 */
	this.start = function(args){
		return q.Promise(function(resolve, reject, notify) {
			var matrix = new Matrix(args.data);
			resolve({reduced: matrix.reduce().data});			
		});
	};
	
	function Matrix(arr){
		var scope = this;
		this.data = undefined;
		
		// inheritance
		ReductionOperations.call(this);
		
		function init(){
			scope.data = JSON.parse(JSON.stringify(arr));
		}
		
		init();
	}
	
	
	/**
	 * Defines operations in order to reduce matrix.
	 * @extends MatrixOperations
	 */
	function ReductionOperations(){
		// inheritance
		MatrixOperations.call(this);
		
		/**
		 * Applies reduction on this matrix for given level (index of diagonal element).
		 * @param level : if not given starts from 0
		 */
		this.reduce = function(level){
			level = level || 0;
			if(!this.ensureOneInDiagonalLevel(level)){
				return this; // done
			}			
			this.reduceRows(level)
				.reduceColumns(level);		
			return (this.existsDiagonalEl(level+1)) ? this.reduce(level+1) : this;
		};
		
		/**
		 * Reduces rows up from given diagonal level by adding columns.
		 */
		this.reduceRows = function(level){
			for(var col = level+1; col < this.data[level].length; col++){
				if(this.data[level][col] !== 0){
					this.addToCol(level, col);
				}
			}					
			return this;
		};
		
		/**
		 * Reduces columns up from given diagonal level by adding rows.
		 */
		this.reduceColumns = function(level){
			for(var row = level+1; row < this.data.length; row++){
				if(this.data[row][level] !== 0){
					this.addToRow(level, row);
				}
			}
			return this;
		};		
		
		/** Up from given diagonal level tries to find a 1 and then exchanges rows/cols
		 *  in order to have the 1 in this diagonal level
		 *  @return boolean
		 */
		this.ensureOneInDiagonalLevel = function(level){
			if(this.data[level][level] === 1){
				return true;
			}
			for(var row = level; row < this.data.length; row++){
				for(var col = level; col < this.data[row].length; col++){
					if(this.data[row][col] === 1){
						this.exchangeRows(level, row);
						this.exchangeCols(level, col);
						return true;
					}
				}
			}			
			return false;
		};
	}
	
	/**
	 * Defines matrix-operations over Z/2Z.
	 * Note the only thing which is specific to the field is the 'add'-method.
	 */
	function MatrixOperations(){		
		/**
		 * Checks if diagonal element in given level exists.
		 */
		this.existsDiagonalEl = function(level){
			return this.data[level] != undefined && this.data[level][level] != undefined;
		};
		
		/**
		 * Exhanges columns by index.
		 */
		this.exchangeCols = function(i,k){
			for(var row = 0; row < this.data.length; row++){
				var first = this.data[row][i];
				this.data[row][i] = this.data[row][k];
				this.data[row][k] = first;
			}		
			return this;
		};
		
		/**
		 * Exhanges rows by index.
		 */
		this.exchangeRows = function(i,k){			
			var first = this.data[i];			
			this.data[i] = this.data[k];
			this.data[k] = first;
			return this;
		};
		
		/**
		 * Adds sourceCol to targetCol and writes result into targetCol.
		 */
		this.addToCol = function(sourceCol, targetCol){
			for(var row = 0; row < this.data.length; row++){
				this.data[row][targetCol] = add(this.data[row][sourceCol], this.data[row][targetCol]);
			}
			return this;
		};
		
		/**
		 * Adds sourceRow to targetRow and writes result into targetRow.
		 */
		this.addToRow = function(sourceRow, targetRow){
			for(var col = 0; col < this.data[sourceRow].length; col++){
				this.data[targetRow][col] = add(this.data[targetRow][col], this.data[sourceRow][col]);
			}
			return this;
		};
		
		/**
		 * adds a and b in Z/2Z
		 */
		function add(a, b){
			return a == b ? 0 : (b > a ? b : a);
		}
	}		
	
	/**
	 * This is called in order to stop a running algorithm.
	 */
	this.stop = function(){
		//TODO
		throw new Error('this is abstract');
	};
}