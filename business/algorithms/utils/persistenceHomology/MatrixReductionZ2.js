
var _ = require('underscore');

module.exports = MatrixReductionZ2;

/**
 * Implements the reduction algorithm used for PersistenceHomologZ2.
 * For detailed description see the comment there.
 */
function MatrixReductionZ2(args){
	
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
			scope.data = sparseCopy(arr);
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
		
		/**
		 * Copies given array sparsely.
		 * @param data : [row[column]]
		 * @returns : a copy
		 */
		function sparseCopy(data){
			var copy = [];
			for(var row in data){
				if(!copy[row]){
					copy[row] = [];
				}
				for(var col in data[row]){
					copy[row][col] = data[row][col];
				}
			}
			return copy;
		}
		
		init();
	}	
	
	/**
	 * Defines operations in order to reduce matrix.
	 * @extends MatrixOperations
	 */
	function ReductionOperations(){
		var scope = this;
		
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
		 * @param col : integer
		 * @returns a column which is before col and has low(col0) = low(col), low
		 * is the position of lowest one (highest row index with 1), if not exists
		 * returns -1
		 */
		function findColSameLowestOne(col){
			var lowestOne = findLowestOne(col);
			if(lowestOne === -1){
				return -1;
			}
			for(var col0 = 0; col0 < col; col0++){
				if(findLowestOne(col0) === lowestOne){
					return col0;
				}						
			}			
			return -1;
		}
		
		/**		  
		 * For given col-index search for a one which has highest row-index in this column.
		 * Returns -1 if not exist a one at all.
		 * @param col: integer
		 * @returns integer
		 */
		function findLowestOne(col){
			var result = -1;
			for(var row in scope.data){
				if(scope.data[parseInt(row)][col] === 1){
					result = Math.max(result, row);
				}
			}
			return result;
		};	
		
	}
	
	/**
	 * Defines matrix-operations over Z/2Z.
	 * Note the only thing which is specific to the field is the 'add'-method.
	 */
	function MatrixOperations(){		
		/**
		 * Adds sourceCol to targetCol and writes result into targetCol.
		 */
		this.addToCol = function(sourceCol, targetCol){						
			for(var row in this.data){
				var result = add(this.data[row][sourceCol], this.data[row][targetCol]);				
				if(result){
					this.data[row][targetCol] = result;
				} else if(this.data[row][targetCol]) {
					delete this.data[row][targetCol];
				}			
			}
			return this;
		};		
		
		/**
		 * This method translates values which valuates to undefined to 0.
		 * adds a and b in Z/2Z
		 */
		function add(a, b){
			var _a = a == undefined ? 0 : a;
			var _b = b == undefined ? 0 : b;
			return _a == _b ? 0 : (_b > _a ? _b : _a);
		}
	}		
	
}