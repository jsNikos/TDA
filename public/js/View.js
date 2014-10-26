define(function(){
	return View;
	
	function View(args){
		var controller = args.controller;
		var chartCtx = jQuery('.chart').get(0).getContext('2d');
		
		this.show = function(results){			
			console.log(results.toJSON());
			chartCtx.lineWidth = 1; 
			chartCtx.moveTo(0,0);
			chartCtx.lineTo(0.5,0.5);
//			chartCtx.stroke(); 
		};
	}
});