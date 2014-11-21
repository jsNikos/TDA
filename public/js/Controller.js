define(['./View',
        'async', 'BaseContentController', 'webSocketController', 'utils',
        'handleError', 'backbone', 'bootstrap', 'parseQuery'], 
function(View, async, BaseContentController, webSocketController, utils, handleError){
	return Controller;
	/**
	 * For simulation a dynamic system.
	 */
	function Controller(){
		var scope = this;
		var view = new View({controller: this});		
		var currentContentController = undefined;	
		var pageRootPath = undefined; // is set to page's root path (form where it is served)
		
		// new content must register controller here, type: BaseContentController
		var contentRegister = {
			'simulations' : 'contents/simulations/SimulationsContentController',
			'complexes': 'contents/complexes/ComplexesContentController'
		};		
		
		function init(){
			async.series([
			              webSocketController.init.bind(null, {}),
			              utils.asTask(initRouter)
			              ], function(err){
				err && handleError(err);
			});					
		}		
		
		function initRouter(){
			var Router = Backbone.Router.extend({
				  routes: {
					    '*path': showContent, // matches all path and splits query-part	 
					  }});
			router = new Router();
			Backbone.history.start({pushState: true});
		}
		
		/**
		 * Based on the given parameters requires for the corresponding controller,
		 * initiates and triggers page-transition on pageView.
		 * @param path : url-path
		 * @param query : query-params, the 'content' is used to extract view, the rest is given the content-controller as argument
		 */
		function showContent(path, query){
			pageRootPath = pageRootPath || path; // first time-set
			var urlState = jQuery.parseQuery(query);
			urlState.content = urlState.content || 'simulations';
			var controllerUri = contentRegister[urlState.content];			
			if(!controllerUri){
				throw new Error('This content-name is not registered, '+urlState.content);
			}
			require([controllerUri], function(Controller){		
				var formerContentController = currentContentController;
				currentContentController = new Controller(urlState);
				currentContentController
				    .on(BaseContentController.READY, function(){
				    	async.series([view.createHideContentTask(formerContentController),
				    	              view.createShowContentTask(currentContentController)]);					
					 })
					.init();
			});
		}				
		
		init();
	}
});