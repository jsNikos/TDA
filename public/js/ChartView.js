define(function(){  
	return ChartView;
	
	function ChartView(args){
		var controller = args.controller;
		
		// options
		var chartHeight = 300;
		var chartWidth = 500;
		
		var x0, y0, x1, y1; // coord-sys
		
		// el
		var $chart = jQuery('.chart');
		var chartCtx = $chart.get(0).getContext('2d');
		
		function init(){
			initCoordSys([{x:0,y:0}, {x:1,y:1}]);
			$chart.attr('height', chartHeight)
				  .attr('width', chartWidth);			
		}
		
		/**
		 * @param coordSys : [{x,y}, {x,y}]; // lower left, upper right
		 */
		function initCoordSys(coordSys){
			x0 = coordSys[0].x;
			y0 = coordSys[0].y;
			x1 = coordSys[1].x;
			y1 = coordSys[1].y;
		}
		
		/**
		 * Transforms coordinates into chart-coordinate system (canvas).
		 * @param coord : {x,y}
		 * @returns {x, y} : coordinates w.r.t canvas
		 */
		function toChartCoord(coord) {
			var x = coord.x;
			var y = coord.y;
			return {
				x : chartWidth * (x - x0) / (x1 - x0),
				y : chartHeight - chartHeight * (y - y0) / (y1 - y0)
			};
		}
		
		this.show = function(results){
			drawPoints(results);
		};
		
		/**
		 * Draws point into canvas.
		 * @param coords : {x,y} (mathematical coordinates), can be array of coordinates
		 */
		function drawPoints(coords) {
			if (!_.isArray(coords)) {
				coords = [ coords ];
			}
			_.each(coords, function(coord) {
				var chartCoord = toChartCoord(coord);
				chartCtx.fillRect(chartCoord.x, chartCoord.y, 1, 1);
			});
		}
		
		init();
	}
});