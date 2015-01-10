
var _ = require('underscore');

module.exports = MatrixReductionZ2;

/**
 * Implements the reduction algorithm used for PersistenceHomologZ2.
 * For detailed description see the comment there.
 */
function MatrixReductionZ2(args){
	var scope = this;	
	
	/**
	 * This is called to start computation. 
	 * @param args: {data : [rows[columns]] - the boundary-matrix}
	 *   			Note, the matrix may be in sparse form, that is rows with only zero must not appear
	 *              and entries with 0 can be undefined. BUT, the indices must be correct! The matrix
	 *              could look like this:
	 *              [0] -> undefined
	 *              [1][0] -> 1
	 *              [1][1] -> undefined
	 *              [3][2] -> 0
	 * @param args : {data : [rows[columns]] - the matrix}
	 * @returns: [rows[columns]]  reduced form, note: this again is sparse
	 * @override
	 */
	this.start = function(args){		
			var matrix = new Matrix(args.data);
			return matrix.reduce().data;	
	};
	
	function Matrix(arr){
		var scope = this; // the matrix
		this.data = undefined;
		this.size = undefined; // the matrix dimension
		
		// inheritance
		ReductionOperations.call(this);
		
		function init(){
			scope.data = JSON.parse(JSON.stringify(arr));
			computeSize();
		}
		
		function computeSize(){
			scope.size = 0;
			for(var row in scope.data){
				scope.size = Math.max(scope.size, parseInt(row) + 1);
				for(var col in scope.data[row]){
					scope.size = Math.max(scope.size, parseInt(col) + 1);
				}
			}
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
		 * Applies reduction on this matrix by column operations (only additions) from left to right.
		 * @param level : if not given starts from 0
		 */
		this.reduce = function(){
			for(var col = 0; col < this.size; col++){
				var col0 = -1;
				while((col0 = findColSameLowestOne(col)) > -1){
					this.addToCol(col0, col);
				}
			}			
			return this;
		};
		
		/**
		 * @returns a column which is before col and has low(col0) = low(col), low
		 * is the position of lowest one (highest row index with 1), if not exists
		 * returns -1
		 */
		function findColSameLowestOne(col){
			//TODO implement
			return -1;
		}
		
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
			//TODO treat undefined
			
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
	
}