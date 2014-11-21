define(['EventEmitter'], function(EventEmitter){
	var Constructor = function(args){
		BaseContentController.prototype = new EventEmitter();
		BaseContentController.prototype.constructor = BaseContentController;
		return new BaseContentController(args);
	};
	// events
	Constructor.READY =  'ready'; // to be fired when data are loaded and view is ready for calls on 'show';
	
	/**
	 * Abstract-layer for all content-controller.
	 * @param args : urlState (query-params from current-url)
	 */
	function BaseContentController(args){
		this.view = undefined;	
		
		/**
		 * Triggers the view to add initialized content ($el) to given $content.
		 * @param $content, the content in which the view to render
		 */
		this.show = function($content){
			this.view.show($content);
		};
		
		/**
		 * Signals the controller is ready with loading.
		 */
		this.fireReady = function(){
			this.fire(Constructor.READY);			
		}.bind(this);
		
		/**
		 * Initializes given View-constructor with given args, this controller instance
		 * is added by default to the args.
		 * @param View - view-constructor
		 * @param args - args to apply
		 */
		this.initPageViewTask = function(View, args){
			var scope = this;
			args = _.extend({controller: this}, args);
			return function(callback){			
				scope.view = new View(args);
				callback();			
			};
		};		
		
	}	
	
	return Constructor;
	
});