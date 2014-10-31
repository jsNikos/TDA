define(function(){  
	return View;

	function View(args){
		var controller = args.controller;		

		// el
		var $el = jQuery('.container');
		
		function init(){
			initLinkList();
			initSimulationControl();
		}	

		function initSimulationControl(){
			jQuery('.simulationControl', $el).on('click', 'button', function(event){
				var $button = jQuery(event.target);				
				switch ($button.attr('data-role')) {
				case 'start': controller.handleStartClicked();
					break;
				case 'stop': controller.handleStopClicked();
					break;
				default:
					throw new Error('Not supported data-role');
					break;
				}
			});
		}
		
		function initLinkList(){
			jQuery('[data-toggle="offcanvas"]', $el).click(function () {
				jQuery('.row-offcanvas').toggleClass('active');
			});
		}

		init();
	}
});