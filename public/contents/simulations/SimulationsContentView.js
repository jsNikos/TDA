define(['BaseContentView',
        'ChartView',
        'text!./simulations.html',
        'css!./simulations.css',
        'animojs'],
function(BaseContentView, ChartView, html){
	return function(args){
		SimulationsContentView.prototype = new BaseContentView(_.extend({html: html}, args));
		SimulationsContentView.prototype.constructor = SimulationsContentView;
		return new SimulationsContentView;
	};
		
	function SimulationsContentView(args){
		var scope = this;
		var chartView = new ChartView({$context: this.$el});	
		
		// el's		
		
		function init(){
			initLinkList();
			initSimulationControl();
		}
		
		/**
		 * Renders given results in chart.
		 * @param results: [{x: number, y: number}], the coordinates
		 */
		this.renderResult = function(results){
			chartView.show(results);
		};
		
		/**
		 * Inits start/stop button for simulation.
		 */
		function initSimulationControl(){
			jQuery('.simulationControl', scope.$el).on('click', 'button', function(event){
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