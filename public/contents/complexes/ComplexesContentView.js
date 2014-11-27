define(['BaseContentView',
        'ChartView',
        'text!./complexes.html',
        'css!./complexes.css',
        'animojs'],
function(BaseContentView, ChartView, html){
	return function(args){
		ComplexesContentView.prototype = new BaseContentView(_.extend({html: html}, args));
		ComplexesContentView.prototype.constructor = ComplexesContentView;
		return new ComplexesContentView;
	};
		
	function ComplexesContentView(args){
		var scope = this;
		var chartView = new ChartView({$context: this.$el});	
		
		// el's		
		
		function init(){
			initLinkList();
			initComplexControl();
		}
		
		/**
		 * Renders given results in chart. 
		 * By default renders the complex belonging to the options.maxScale.
		 * @params results : {channel: string,
		 * 				       detail: {options: object, algorithm: string},
		 *                       data: {vertices:[Vertex], complex:[Simplex]}
		 *                   }
		 */
		this.renderResult = function(results){
			var fvertices = {};
			// create a fast-access
			_.each(results.data.vertices, function(vertex){
				fvertices[vertex.id] = vertex;
			});
			
			_.each(results.data.complex, function(simplex){
				var verticesCoords = extractSimplexCoords(simplex, fvertices);
				chartView.drawSimplex(_.extend({verticesCoords: verticesCoords}, simplex));
			});			
		};
		
		/**
		 * extracts coordinates of vertices of given simplex
		 * @params simplex
		 * @params fvertices : {id : vertex}  fast-vertex-access map
		 * @returns [[x, y]]
		 */ 
		function extractSimplexCoords(simplex, fvertices){			
			return _.map(simplex.vertices, function(vertex){
				return fvertices[vertex].coords;
			});			
		}
		
		/**
		 * Inits start/stop button for complex computation.
		 */
		function initComplexControl(){
			jQuery('.complexControl', scope.$el).on('click', 'button', function(event){
				var $button = jQuery(event.target);				
				switch ($button.attr('data-role')) {
				case 'start': scope.controller.handleStartClicked();
					break;
				case 'stop': scope.controller.handleStopClicked();
					break;
				default:
					throw new Error('Not supported data-role');
					break;
				}
			});
		}
		
		/**
		 * Inits the link-list for selecting simulations.
		 */
		function initLinkList(){
			jQuery('[data-toggle="offcanvas"]', scope.$el).click(function () {
				jQuery('.row-offcanvas').toggleClass('active');
			});
		}
		
		
		init();
	}
});