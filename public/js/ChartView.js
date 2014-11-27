define(function(){  
	return ChartView;
	
	/**
	 * For displaying points in a 2-dim coordinate system.
	 */
	function ChartView(args){
		
		// options
		var chartHeight = 600;
		var chartWidth = 600;
		
		var x0, y0, x1, y1; // coord-sys
		
		// el
		var $chart = jQuery('.chart', args.$context);
		var chartCtx = $chart.get(0).getContext('2d');
		
		function init(){
			initCoordSys([{x:-1.5,y:1.5}, {x:1.5,y:-1.5}]);
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
		
		/**
		 * Adds given points to chart.
		 * @param results : [{x: number, y: number}], the coordinates
		 */
		this.show = function(results){
			drawPoints(results);
		};
		
		/**
		 * Draws given simplex if dimension <= 2
		 * @params simplex: {dimension: integer, verticesCoords: [[x,y]] (coordinates)}
		 */
		this.drawSimplex = function(simplex){
			switch (simplex.dimension) {
			case 0:
				drawPoints({x: simplex.verticesCoords[0][0], y: simplex.verticesCoords[0][1]});
				break;
			case 1:
				drawLine(simplex.verticesCoords[0], simplex.verticesCoords[1]);
				break;
			case 2:
				drawTriangle(simplex.verticesCoords[0], simplex.verticesCoords[1], simplex.verticesCoords[2]);
				break;
			default:
				break;
			}
		};
		
		/**
		 * Draws 2-simplex based on given vertices
		 */
		function drawTriangle(v0, v1, v2){
			chartCtx.beginPath();
			chartCtx.lineWidth= '0';
//			chartCtx.strokeStyle= '#cccccc'; 
			chartCtx.fillStyle="#cccccc";			
			
			var chartCoordV0 = toChartCoord({x: v0[0], y: v0[1]});
			chartCtx.moveTo(chartCoordV0.x, chartCoordV0.y);
			var chartCoordV1 = toChartCoord({x: v1[0], y: v1[1]});
			chartCtx.lineTo(chartCoordV1.x, chartCoordV1.y);
			var chartCoordV2 = toChartCoord({x: v2[0], y: v2[1]});
			chartCtx.lineTo(chartCoordV2.x, chartCoordV2.y);
			chartCtx.fill(); 
			chartCtx.stroke(); 
		}
		
		/**
		 * Draws a line.
		 * @params from: [x,y]
		 * @params to: [x,y]
		 */
		function drawLine(from, to){
			chartCtx.beginPath();
			chartCtx.lineWidth= '1';
			chartCtx.strokeStyle= '#888888'; 
			
			var chartCoordFrom = toChartCoord({x: from[0], y: from[1]});
			chartCtx.moveTo(chartCoordFrom.x, chartCoordFrom.y);
			var chartCoordTo = toChartCoord({x: to[0], y: to[1]});
			chartCtx.lineTo(chartCoordTo.x , chartCoordTo.y);
			chartCtx.stroke(); 
		}
		
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
				chartCtx.beginPath();
				chartCtx.fillStyle="#000000";
				chartCtx.arc(chartCoord.x, chartCoord.y,1,0,2*Math.PI);
				chartCtx.fill();
				chartCtx.stroke();
			});
		}
		
		init();
	}
});